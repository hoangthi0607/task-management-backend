/**
 * @swagger
 * components:
 *   schemas:
 *     Project:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         project_id:
 *           type: integer
 *           description: The auto-generated id of the project
 *         name:
 *           type: string
 *           description: The name of the project
 *         description:
 *           type: string
 *           description: The description of the project
 *         start_date:
 *           type: string
 *           format: date
 *           description: The start date of the project
 *         end_date:
 *           type: string
 *           format: date
 *           description: The end date of the project
 *         manager_id:
 *           type: integer
 *           description: The manager id of the project
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: The creation timestamp
 *     CreateProjectDto:
 *       type: object
 *       required:
 *         - name
 *         - description
 *         - start_date
 *         - end_date
 *         - manager_id
 *       properties:
 *         name:
 *           type: string
 *           description: Tên dự án
 *         description:
 *           type: string
 *           description: Mô tả dự án
 *         start_date:
 *           type: string
 *           format: date
 *           description: Ngày bắt đầu dự án
 *         end_date:
 *           type: string
 *           format: date
 *           description: Ngày kết thúc dự án
 *         manager_id:
 *           type: integer
 *           description: ID của quản lý dự án
 */

/**
 * @swagger
 * /projects:
 *   get:
 *     summary: Lấy danh sách tất cả dự án
 *     tags: [Projects]
 *     responses:
 *       200:
 *         description: Danh sách dự án
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
 *                     $ref: '#/components/schemas/Project'
 */

/**
 * @swagger
 * /projects/{id}:
 *   get:
 *     summary: Lấy chi tiết dự án theo ID
 *     tags: [Projects]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID của dự án
 *     responses:
 *       200:
 *         description: Chi tiết dự án
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Project'
 *       404:
 *         description: Không tìm thấy dự án
 */

/**
 * @swagger
 * /projects/manager/{managerId}:
 *   get:
 *     summary: Lấy danh sách dự án của một quản lý
 *     tags: [Projects]
 *     parameters:
 *       - in: path
 *         name: managerId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID của quản lý
 *     responses:
 *       200:
 *         description: Danh sách dự án của quản lý
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
 *                     $ref: '#/components/schemas/Project'
 */

/**
 * @swagger
 * /projects:
 *   post:
 *     summary: Tạo dự án mới
 *     tags: [Projects]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateProjectDto'
 *     responses:
 *       201:
 *         description: Dự án đã được tạo
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Project'
 *       400:
 *         description: Dữ liệu không hợp lệ
 */

/**
 * @swagger
 * /projects/{id}:
 *   patch:
 *     summary: Cập nhật dự án
 *     tags: [Projects]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID của dự án
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateProjectDto'
 *     responses:
 *       200:
 *         description: Dự án đã được cập nhật
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Project'
 *       404:
 *         description: Không tìm thấy dự án
 */

/**
 * @swagger
 * /projects/{id}:
 *   delete:
 *     summary: Xóa dự án
 *     tags: [Projects]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID của dự án
 *     responses:
 *       200:
 *         description: Dự án đã được xóa
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: Không tìm thấy dự án
 */
