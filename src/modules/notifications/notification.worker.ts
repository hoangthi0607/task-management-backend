// src/notifications/db-scanner.worker.ts
import { prisma } from "../../shared/prisma/prisma.service.js";
import * as amqp from 'amqplib';
import { NotificationWorker } from "./notification.infrastructure.js";


export class DBNotificationScanner {
    private prisma = prisma;
    private channel: amqp.Channel | null = null;
    private readonly exchangeName = 'notification_exchange';
    private readonly routingKey = 'push_notification';
    private readonly intervalTime = 50000; // 5 giây (Cấu hình tùy ý bạn)
    private workerInstance: NotificationWorker;
    private isLoopActive = true;

    constructor(rabbitChannel: amqp.Channel, worker: NotificationWorker) {
        this.channel = rabbitChannel;
        this.workerInstance = worker;
    }

    /**
     * Khởi động vòng lặp quét DB ngầm
     */
    public start(): void {
        console.log('[DB Scanner] ⏰ Đang chạy ngầm quét lịch thông báo...');
        this.runLoop();
    }
    public stop(): void {
        this.isLoopActive = false;
    }

    private async runLoop(): Promise<void> {
        if (!this.isLoopActive) return;
        try {
            await this.scanAndPublish();
        } catch (error:any) {
            console.error('[DB Scanner Error] Gặp lỗi khi quét dữ liệu:', error.message);
        } finally {
            // QUAN TRỌNG: Chỉ thiết lập lịch tiếp theo sau khi lượt cũ đã HOÀN THÀNH hoàn toàn
            setTimeout(() => this.runLoop(), this.intervalTime);
        }
    }

    /**
     * Logic quét DB và đẩy vào RabbitMQ
     */
    private async scanAndPublish(): Promise<void> {
        const channel = this.workerInstance.getChannel();
        if (!channel) return; 
        
        const now = new Date();

        // 1. Tìm các thông báo đã tới giờ gửi mà chưa gửi
        const pendingNotifications = await this.prisma.notification.findMany({
            where: {
                is_sent: false,
                scheduled_at: {
                    lte: now // Nhỏ hơn hoặc bằng thời gian hiện tại
                }
            },
            take: 50 // Giới hạn mỗi lần xử lý tối đa 50 bản ghi để tránh nghẽn bộ nhớ
        });

        if (pendingNotifications.length === 0) return;

        console.log(`[DB Scanner] 🔍 Tìm thấy ${pendingNotifications.length} thông báo cần xử lý.`);

        for (const notification of pendingNotifications) {
            try {
                // 2. Định dạng dữ liệu Event chuẩn bị gửi sang RabbitMQ Worker (Loại 2)
                const eventData = {
                    id: notification.notification_id,
                    user_id: notification.user_id,
                    task_id: notification.task_id,
                    title: notification.title,
                    message: notification.message
                };

                // 3. Đẩy vào RabbitMQ
                if (this.channel) {
                    this.channel.publish(
                        this.exchangeName,
                        this.routingKey,
                        Buffer.from(JSON.stringify(eventData)),
                        { persistent: true } // Lưu trữ bền vững tin nhắn trong hàng đợi
                    );
                }

                // 4. Đánh dấu trong DB là đã xử lý (hoặc đã đẩy vào hàng đợi) để không bị quét lại
                await this.prisma.notification.update({
                    where: { notification_id: notification.notification_id },
                    data: { is_sent: true }
                });

            } catch (err:any) {
                console.error(`[DB Scanner] Lỗi khi xử lý bản ghi ID ${notification.notification_id}:`, err.message);
                // Bạn có thể update trạng thái lỗi vào DB nếu muốn
            }
        }
    }
}
