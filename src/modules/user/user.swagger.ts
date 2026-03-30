/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         user_id:
 *           type: integer
 *           description: The auto-generated id of the user
 *         email:
 *           type: string
 *           format: email
 *           description: The email of the user
 *         password:
 *           type: string
 *           description: The hashed password of the user
 *         role_id:
 *           type: integer
 *           description: The role id of the user
 *         department_id:
 *           type: integer
 *           description: The department id of the user
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: The creation timestamp
 *     CreateUserDto:
 *       type: object
 *       required:
 *         - email
 *         - password
 *         - role_id
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: Email của người dùng
 *         password:
 *           type: string
 *           minLength: 6
 *           description: Mật khẩu
 *         role_id:
 *           type: integer
 *           description: ID của vai trò
 *         department_id:
 *           type: integer
 *           description: ID của phòng ban
 *     UpdateUserDto:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: Email của người dùng
 *         password:
 *           type: string
 *           minLength: 6
 *           description: Mật khẩu mới
 *         role_id:
 *           type: integer
 *           description: ID của vai trò
 *         department_id:
 *           type: integer
 *           description: ID của phòng ban
 */

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Tạo người dùng mới
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateUserDto'
 *     responses:
 *       201:
 *         description: Người dùng đã được tạo
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Dữ liệu không hợp lệ
 */

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Tạo người dùng mới
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateUserDto'
 *     responses:
 *       201:
 *         description: Người dùng đã được tạo
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Dữ liệu không hợp lệ
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Lấy danh sách tất cả người dùng
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Danh sách người dùng
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       401:
 *         description: Không có quyền truy cập
 */

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Lấy thông tin người dùng theo ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID của người dùng
 *     responses:
 *       200:
 *         description: Thông tin người dùng
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Không có quyền truy cập
 *       404:
 *         description: Không tìm thấy người dùng
 */

/**
 * @swagger
 * /users/{id}:
 *   patch:
 *     summary: Cập nhật thông tin người dùng
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID của người dùng
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateUserDto'
 *     responses:
 *       200:
 *         description: Người dùng đã được cập nhật
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Không có quyền truy cập
 *       404:
 *         description: Không tìm thấy người dùng
 */

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Xóa người dùng
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID của người dùng
 *     responses:
 *       200:
 *         description: Người dùng đã được xóa
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Không có quyền truy cập
 *       404:
 *         description: Không tìm thấy người dùng
 */
