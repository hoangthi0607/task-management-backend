/**
 * @swagger
 * components:
 *   schemas:
 *     Report:
 *       type: object
 *       required:
 *         - report_type
 *         - report_data
 *       properties:
 *         report_id:
 *           type: integer
 *           description: The auto-generated id of the report
 *         report_type:
 *           type: string
 *           enum: [task_summary, project_summary, user_performance, department_overview]
 *           description: Loại báo cáo
 *         report_data:
 *           type: object
 *           description: Dữ liệu báo cáo
 *         generated_at:
 *           type: string
 *           format: date-time
 *           description: Thời gian tạo báo cáo
 *         created_by:
 *           type: integer
 *           description: ID người tạo báo cáo
 *         project_id:
 *           type: integer
 *           description: ID dự án (nếu có)
 *     CreateReportDto:
 *       type: object
 *       required:
 *         - report_type
 *         - report_data
 *       properties:
 *         report_type:
 *           type: string
 *           enum: [task_summary, project_summary, user_performance, department_overview]
 *           description: Loại báo cáo
 *         report_data:
 *           type: object
 *           description: Dữ liệu báo cáo
 *         project_id:
 *           type: integer
 *           description: ID dự án (tùy chọn)
 */

/**
 * @swagger
 * /reports:
 *   get:
 *     summary: Lấy danh sách tất cả báo cáo
 *     tags: [Reports]
 *     responses:
 *       200:
 *         description: Danh sách báo cáo
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
 *                     $ref: '#/components/schemas/Report'
 */

/**
 * @swagger
 * /reports/{id}:
 *   get:
 *     summary: Lấy chi tiết báo cáo theo ID
 *     tags: [Reports]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID của báo cáo
 *     responses:
 *       200:
 *         description: Chi tiết báo cáo
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Report'
 *       404:
 *         description: Không tìm thấy báo cáo
 */

/**
 * @swagger
 * /reports/project/{projectId}:
 *   get:
 *     summary: Lấy danh sách báo cáo của một dự án
 *     tags: [Reports]
 *     parameters:
 *       - in: path
 *         name: projectId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID của dự án
 *     responses:
 *       200:
 *         description: Danh sách báo cáo của dự án
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
 *                     $ref: '#/components/schemas/Report'
 */

/**
 * @swagger
 * /reports:
 *   post:
 *     summary: Tạo báo cáo mới
 *     tags: [Reports]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateReportDto'
 *     responses:
 *       201:
 *         description: Báo cáo đã được tạo
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Report'
 *       400:
 *         description: Dữ liệu không hợp lệ
 */

/**
 * @swagger
 * /reports/project/{projectId}/generate:
 *   post:
 *     summary: Tạo báo cáo tự động cho dự án
 *     tags: [Reports]
 *     parameters:
 *       - in: path
 *         name: projectId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID của dự án
 *     responses:
 *       201:
 *         description: Báo cáo đã được tạo tự động
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Report'
 *       404:
 *         description: Không tìm thấy dự án
 */

/**
 * @swagger
 * /reports/{id}:
 *   patch:
 *     summary: Cập nhật báo cáo
 *     tags: [Reports]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID của báo cáo
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateReportDto'
 *     responses:
 *       200:
 *         description: Báo cáo đã được cập nhật
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Report'
 *       404:
 *         description: Không tìm thấy báo cáo
 */

/**
 * @swagger
 * /reports/{id}:
 *   delete:
 *     summary: Xóa báo cáo
 *     tags: [Reports]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID của báo cáo
 *     responses:
 *       200:
 *         description: Báo cáo đã được xóa
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: Không tìm thấy báo cáo
 */
