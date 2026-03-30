/**
 * @swagger
 * components:
 *   schemas:
 *     Notification:
 *       type: object
 *       required:
 *         - user_id
 *         - message
 *         - type
 *       properties:
 *         notification_id:
 *           type: integer
 *           description: The auto-generated id of the notification
 *         user_id:
 *           type: integer
 *           description: ID người dùng nhận thông báo
 *         task_id:
 *           type: integer
 *           description: ID công việc liên quan (tùy chọn)
 *         message:
 *           type: string
 *           description: Nội dung thông báo
 *         type:
 *           type: string
 *           enum: [task_assigned, task_completed, task_overdue, project_update, system]
 *           description: Loại thông báo
 *         is_read:
 *           type: boolean
 *           description: Trạng thái đã đọc
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: Thời gian tạo thông báo
 *     CreateNotificationDto:
 *       type: object
 *       required:
 *         - user_id
 *         - message
 *         - type
 *       properties:
 *         user_id:
 *           type: integer
 *           description: ID người dùng nhận thông báo
 *         task_id:
 *           type: integer
 *           description: ID công việc liên quan (tùy chọn)
 *         message:
 *           type: string
 *           description: Nội dung thông báo
 *         type:
 *           type: string
 *           enum: [task_assigned, task_completed, task_overdue, project_update, system]
 *           description: Loại thông báo
 */

/**
 * @swagger
 * /notifications:
 *   get:
 *     summary: Lấy danh sách tất cả thông báo
 *     tags: [Notifications]
 *     responses:
 *       200:
 *         description: Danh sách thông báo
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Notification'
 */

/**
 * @swagger
 * /notifications/{id}:
 *   get:
 *     summary: Lấy chi tiết thông báo theo ID
 *     tags: [Notifications]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID của thông báo
 *     responses:
 *       200:
 *         description: Chi tiết thông báo
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Notification'
 *       404:
 *         description: Không tìm thấy thông báo
 */

/**
 * @swagger
 * /notifications/user/{userId}:
 *   get:
 *     summary: Lấy danh sách thông báo của một người dùng
 *     tags: [Notifications]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID của người dùng
 *     responses:
 *       200:
 *         description: Danh sách thông báo của người dùng
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Notification'
 */

/**
 * @swagger
 * /notifications/task/{taskId}:
 *   get:
 *     summary: Lấy danh sách thông báo của một công việc
 *     tags: [Notifications]
 *     parameters:
 *       - in: path
 *         name: taskId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID của công việc
 *     responses:
 *       200:
 *         description: Danh sách thông báo của công việc
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Notification'
 */

/**
 * @swagger
 * /notifications:
 *   post:
 *     summary: Tạo thông báo mới
 *     tags: [Notifications]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateNotificationDto'
 *     responses:
 *       201:
 *         description: Thông báo đã được tạo
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Notification'
 *       400:
 *         description: Dữ liệu không hợp lệ
 */

/**
 * @swagger
 * /notifications/{id}:
 *   patch:
 *     summary: Cập nhật thông báo
 *     tags: [Notifications]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID của thông báo
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateNotificationDto'
 *     responses:
 *       200:
 *         description: Thông báo đã được cập nhật
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Notification'
 *       404:
 *         description: Không tìm thấy thông báo
 */

/**
 * @swagger
 * /notifications/{id}:
 *   delete:
 *     summary: Xóa thông báo
 *     tags: [Notifications]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID của thông báo
 *     responses:
 *       200:
 *         description: Thông báo đã được xóa
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: Không tìm thấy thông báo
 */
