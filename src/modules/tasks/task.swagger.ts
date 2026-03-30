/**
 * @swagger
 * components:
 *   schemas:
 *     Task:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         task_id:
 *           type: integer
 *           description: The auto-generated id of the task
 *         name:
 *           type: string
 *           description: The name of the task
 *         description:
 *           type: string
 *           description: The description of the task
 *         deadline:
 *           type: string
 *           format: date
 *           description: The deadline of the task
 *         status:
 *           type: string
 *           enum: [todo, in_progress, done]
 *           description: The status of the task
 *         project_id:
 *           type: integer
 *           description: The project id this task belongs to
 *         assigned_user_id:
 *           type: integer
 *           description: The user id assigned to this task
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: The creation timestamp
 *     CreateTaskDto:
 *       type: object
 *       required:
 *         - name
 *         - description
 *         - deadline
 *         - status
 *         - project_id
 *         - assigned_user_id
 *       properties:
 *         name:
 *           type: string
 *           description: The name of the task
 *         description:
 *           type: string
 *           description: The description of the task
 *         deadline:
 *           type: string
 *           format: date-time
 *           example: "2026-04-29T00:00:00.000Z"
 *           description: The deadline of the task (ISO 8601)
 *         status:
 *           type: string
 *           enum: [todo, in_progress, done]
 *           description: The status of the task
 *         project_id:
 *           type: integer
 *           description: The project id this task belongs to
 *         assigned_user_id:
 *           type: integer
 *           description: The user id assigned to this task
 *     UpdateTaskDto:
 *       type: object
 *       required:
 *         - name
 *         - description
 *         - deadline
 *         - status
 *         - project_id
 *         - assigned_user_id
 *       properties:
 *         name:
 *           type: string
 *           description: The name of the task
 *         description:
 *           type: string
 *           description: The description of the task
 *         deadline:
 *           type: string
 *           format: date-time
 *           description: The deadline of the task (ISO 8601)
 *         status:
 *           type: string
 *           enum: [todo, in_progress, done]
 *           description: The status of the task
 *         project_id:
 *           type: integer
 *           description: The project id this task belongs to
 *         assigned_user_id:
 *           type: integer
 *           description: The user id assigned to this task
 */

/**
 * @swagger
 * /tasks:
 *   get:
 *     summary: Lấy danh sách tất cả công việc
 *     tags: [Tasks]
 *     responses:
 *       200:
 *         description: Danh sách công việc
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
 *                     $ref: '#/components/schemas/Task'
 */

/**
 * @swagger
 * /tasks/{id}:
 *   get:
 *     summary: Lấy chi tiết công việc theo ID
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID của công việc
 *     responses:
 *       200:
 *         description: Chi tiết công việc
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       404:
 *         description: Không tìm thấy công việc
 */

/**
 * @swagger
 * /tasks:
 *   post:
 *     summary: Tạo công việc mới
 *     tags: [Tasks]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateTaskDto'
 *     responses:
 *       201:
 *         description: Công việc đã được tạo
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Task'
 *       400:
 *         description: Dữ liệu không hợp lệ
 */

/**
 * @swagger
 * /tasks/{id}:
 *   patch:
 *     summary: Cập nhật công việc
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID của công việc
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateTaskDto'
 *     responses:
 *       200:
 *         description: Công việc đã được cập nhật
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Task'
 *       404:
 *         description: Không tìm thấy công việc
 */

/**
 * @swagger
 * /tasks/{id}:
 *   delete:
 *     summary: Xóa công việc
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID của công việc
 *     responses:
 *       200:
 *         description: Công việc đã được xóa
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: Không tìm thấy công việc
 */

/**
 * @swagger
 * /tasks/project/{projectId}:
 *   get:
 *     summary: Lấy danh sách công việc của một dự án
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: projectId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID của dự án
 *     responses:
 *       200:
 *         description: Danh sách công việc của dự án
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
 *                     $ref: '#/components/schemas/Task'
 */
