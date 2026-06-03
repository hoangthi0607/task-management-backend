// src/notifications/notification.worker.ts
import * as amqp from 'amqplib';
import { TaskDueEvent } from './notification.interface.js';
import { notificationService, NotificationService } from './notification.service.js';
import { CreateNotificationDto } from './notification.dto.js';
import { TaskService } from '../tasks/task.service.js';
import { RabbitMQNotificationPublisher } from '../tasks/task.infrastructure.js';

export class NotificationWorker {
    private connection: amqp.ChannelModel | null = null;
    private channel: amqp.Channel | null = null;

    private readonly rabbitMQUrl: string;
    private readonly exchangeName = 'notification_exchange';
    private readonly queueName = 'notification_queue';
    private readonly routingKey = 'push_notification';

    constructor(url: string = 'amqp://admin:admin123@localhost:5672') {
        this.rabbitMQUrl = url;
    }

    public getChannel(): amqp.Channel | null {
        return this.channel;
    }

    /**
     * Khởi động Worker ngầm kết nối tới RabbitMQ
     */
    public async start(): Promise<void> {
        try {
            // 1. Mở kết nối mạng TCP và tạo Channel
            this.connection = await amqp.connect(this.rabbitMQUrl);
            this.channel = await this.connection.createChannel();

            // 2. Cam kết cấu hình Exchange (Trùng khớp 100% cấu hình với bên gửi)
            await this.channel.assertExchange(this.exchangeName, 'direct', { durable: true });

            // 3. Tự động tạo Queue hứng tin nhắn nếu chưa tồn tại
            await this.channel.assertQueue(this.queueName, { durable: true });

            // 4. ĐĂNG KÝ (BINDING): Liên kết Queue vào Exchange thông qua Routing Key
            await this.channel.bindQueue(this.queueName, this.exchangeName, this.routingKey);

            // 5. Cấu hình Prefetch: Mỗi lần chỉ lấy tối đa 10 tin nhắn để xử lý (Tránh quá tải RAM)
            await this.channel.prefetch(10);

            console.log(`[Notification Worker] 🚀 Đang chạy ngầm và lắng nghe hàng đợi: ${this.queueName}`);

            // 6. Bắt đầu tiêu thụ tin nhắn
            await this.channel.consume(this.queueName, async (msg) => {
                if (!msg) return;

                try {
                    // Giải mã gói tin từ Buffer sang chuỗi JSON dữ liệu chuẩn
                    const event: TaskDueEvent = JSON.parse(msg.content.toString());

                    // --- MỌI LOGIC XỬ LÝ NỘI BỘ CỦA MONOLITH ĐẶT TẠI ĐÂY ---
                    console.log(`\n[📩 Monolith Worker] Nhận Event: ${event.eventId}`);
                    console.log(`-> Tiêu đề: ${event.payload.title}`);
                    console.log(`-> Gửi tới UserId: ${event.userId}`);

                    // Ví dụ gọi hàm Service thật trong Monolith của bạn:
                    const data: CreateNotificationDto = { title: event.payload.title, content: event.payload.body, message: event.payload.body, scheduled_at: event.scheduled_at, user_id: parseInt(event.userId), task_id: parseInt(event.taskId) };
                    await notificationService.createNotification(data);
                    // -----------------------------------------------------

                    // BẮT BUỘC: Xác nhận đã làm xong để RabbitMQ xóa tin nhắn khỏi hàng đợi
                    this.channel?.ack(msg);

                } catch (error) {
                    console.error('[Notification Worker] Lỗi xử lý nội dung tin nhắn:', error);

                    // Nếu lỗi do logic code hỏng (JSON sai cấu trúc...), loại bỏ tin nhắn để tránh nghẽn mạch
                    // Nếu lỗi do hạ tầng sập (ví dụ api gửi mail của bên thứ 3 lỗi), bạn đổi thành nack(msg, false, true) để thử lại
                    this.channel?.ack(msg);
                }
            });

            // Lắng nghe sự cố ngắt kết nối đột ngột để xử lý phục hồi tự động
            this.connection.on('error', (err) => { console.error('[RabbitMQ Consumer Err]', err); });

        } catch (error) {
            console.error('❌ [Notification Worker] Không thể khởi động hàng đợi kết nối:', error);
            // Thử kết nối lại sau 5 giây nếu lỗi hạ tầng Docker chưa bật kịp
            setTimeout(() => this.start(), 5000);
        }
    }

    /**
     * Tắt Worker an toàn khi ứng dụng Monolith dừng (Graceful Shutdown)
     */
    public async stop(): Promise<void> {
        if (this.channel) await this.channel.close();
        if (this.connection) await this.connection.close();
        console.log('[Notification Worker] Đã ngắt kết nối an toàn.');
    }
}
