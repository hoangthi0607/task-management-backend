// task.infrastructure.ts
import * as amqp from 'amqplib';

import { INotificationPublisher, TaskData, TaskDueEvent } from './task.interface.js';

// 1. Định nghĩa Interface của tầng Domain (Nếu chưa có ở file khác, bạn có thể khai báo tạm tại đây)

// 2. Định nghĩa cấu trúc dữ liệu Event (Để làm sạch dữ liệu trước khi gửi sang Service Notification)

// 3. Triển khai Class Hạ tầng kết nối với RabbitMQ (Sử dụng thiết kế Singleton để tối ưu kết nối)
export class RabbitMQNotificationPublisher implements INotificationPublisher {
    private connection: amqp.ChannelModel | null = null;
    private channel: amqp.Channel | null = null;

    private readonly rabbitMQUrl: string;
    private readonly exchangeName = 'notification_exchange';
    private readonly routingKey = 'push_notification';

    constructor(url: string = 'amqp://admin:admin123@localhost:5672') {
        this.rabbitMQUrl = url;
    }

    /**
     * Khởi tạo kết nối đến RabbitMQ (Chỉ kết nối 1 lần duy nhất trong suốt vòng đời ứng dụng)
     */
    private async init(): Promise<amqp.Channel> {
        if (this.channel) {
            return this.channel;
        }

        try {
            // Mở kết nối TCP và tạo Channel
            this.connection = await amqp.connect(this.rabbitMQUrl);
            this.channel = await this.connection.createChannel();

            // Cấu hình Exchange bền vững (Durable) để không mất cấu hình khi RabbitMQ khởi động lại
            await this.channel.assertExchange(this.exchangeName, 'direct', { durable: true });

            // Lắng nghe sự kiện đóng kết nối đột ngột để xóa cache kết nối
            this.connection.on('error', () => { this.channel = null; });
            this.connection.on('close', () => { this.channel = null; });

            return this.channel;
        } catch (error) {
            console.error('[RabbitMQ] Kết nối đến Broker thất bại:', error);
            this.channel = null;
            throw error;
        }
    }

    /**
     * Hàm thực hiện bắn sự kiện sang hệ thống xếp hàng tin nhắn
     */
    public async publish(taskData: TaskData): Promise<void> {
        try {
            const channel = await this.init();

            // LỚP CHỐNG NHIỄM ĐỘC DỮ LIỆU (ACL): 
            // Chuyển đổi dữ liệu Entity nội bộ của Monolith thành một Payload Sự kiện chuẩn hóa, tường minh
            const event: TaskDueEvent = {
                eventId: `evt_${Date.now()}_${taskData.id}`,
                taskId: String(taskData.id),
                userId: String(taskData.assigned_user_id),
                eventType: 'TASK_DUE_REMINDER',
                scheduled_at: taskData.deadline || new Date(), // Ví dụ: Sử dụng deadline của task làm thời gian lên lịch
                timestamp: new Date().toISOString(),
                payload: {
                    title: `Nhắc nhở: Công việc "${taskData.name}" sắp đến hạn!`,
                    body: `Công việc "${taskData.name}" có deadline vào ${taskData.deadline ? new Date(taskData.deadline).toLocaleString() : 'không xác định'}. Vui lòng kiểm tra và hoàn thành đúng hạn.`
                }
            };

            // Đẩy tin nhắn vào Exchange kèm thuộc tính persistent: true (Ghi đĩa cứng đề phòng sập nguồn)
            const isPublished = channel.publish(
                this.exchangeName,
                this.routingKey,
                Buffer.from(JSON.stringify(event)),
                { persistent: true }
            );

            if (isPublished) {
                console.log(`[Infrastructure] Đã đẩy thành công Event ${event.eventId} lên RabbitMQ.`);
            } else {
                console.warn(`[Infrastructure] Hàng đợi tạm thời bị đầy, Event ${event.eventId} đang nằm trong bộ đệm ứng dụng.`);
            }

        } catch (error) {
            console.error('[Infrastructure] Không thể publish sự kiện do lỗi hạ tầng:', error);
            // Bạn có thể bổ sung logic ghi log lỗi vào File hoặc DB giám sát tại đây (ví dụ: Winston, Sentry)
        }
    }

    /**
     * Hàm ngắt kết nối an toàn khi ứng dụng Monolith tắt (Graceful Shutdown)
     */
    public async close(): Promise<void> {
        if (this.channel) await this.channel.close();
        if (this.connection) await this.connection.close();
        this.channel = null;
        this.connection = null;
    }
}
