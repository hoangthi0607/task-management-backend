/**
 * @swagger
 * components:
 *   schemas:
 *     Role:
 *       type: object
 *       required:
 *         - role_name
 *       properties:
 *         role_id:
 *           type: integer
 *           description: The auto-generated id of the role
 *         role_name:
 *           type: string
 *           description: The name of the role
 *     CreateRoleDto:
 *       type: object
 *       required:
 *         - role_name
 *       properties:
 *         role_name:
 *           type: string
 *           description: Tên vai trò
 */

/**
 * @swagger
 * /roles:
 *   get:
 *     summary: Lấy danh sách tất cả vai trò
 *     tags: [Roles]
 *     responses:
 *       200:
 *         description: Danh sách vai trò
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
 *                     $ref: '#/components/schemas/Role'
 */

/**
 * @swagger
 * /roles/{id}:
 *   get:
 *     summary: Lấy chi tiết vai trò theo ID
 *     tags: [Roles]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID của vai trò
 *     responses:
 *       200:
 *         description: Chi tiết vai trò
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Role'
 *       404:
 *         description: Không tìm thấy vai trò
 */

/**
 * @swagger
 * /roles:
 *   post:
 *     summary: Tạo vai trò mới
 *     tags: [Roles]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateRoleDto'
 *     responses:
 *       201:
 *         description: Vai trò đã được tạo
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Role'
 *       400:
 *         description: Dữ liệu không hợp lệ
 */

/**
 * @swagger
 * /roles/{id}:
 *   patch:
 *     summary: Cập nhật vai trò
 *     tags: [Roles]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID của vai trò
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateRoleDto'
 *     responses:
 *       200:
 *         description: Vai trò đã được cập nhật
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Role'
 *       404:
 *         description: Không tìm thấy vai trò
 */

/**
 * @swagger
 * /roles/{id}:
 *   delete:
 *     summary: Xóa vai trò
 *     tags: [Roles]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID của vai trò
 *     responses:
 *       200:
 *         description: Vai trò đã được xóa
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: Không tìm thấy vai trò
 */
