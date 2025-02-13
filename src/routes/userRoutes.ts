import { Router } from 'express';
import { UserController } from '../controllers/UserController';

const router = Router();

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Successfully retrieved users
 *         content:
 *           application/json:
 *             example:
 *               users: [{ id: 1, name: "John" }]
 */
router.get('/', UserController.getUsers);
router.get('/:id', UserController.getUserById);
router.post('/', UserController.createUser);
router.put('/:id', UserController.updateUser);
router.delete('/:id', UserController.deleteUser);

export default router;