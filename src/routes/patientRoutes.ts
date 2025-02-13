import { Router } from 'express';
import { PatientController } from '../controllers/PatientController';

const router = Router();

/**
 * @swagger
 * /Patient:
 *   get:
 *     summary: Get all Patient
 *     tags: [Patient]
 *     responses:
 *       200:
 *         description: Successfully retrieved Patient
 *         content:
 *           application/json:
 *             example:
 *               Patient: [{ id: 1, name: "John" }]
 */
router.get('/', PatientController.getPatients);

/**
 * @swagger
 * /Patient/{id}:
 *   get:
 *     summary: Get Patient By Id
 *     tags: [Patient]
 *     responses:
 *       200:
 *         description: Successfully retrieved Patient
 *         content:
 *           application/json:
 *             example:
 *               Patient: [{ id: 1, name: "John" }]
 */
router.get('/:id', PatientController.getPatientById);

/**
 * @swagger
 * /Patient:
 *   post:
 *     summary: Create Patient
 *     tags: [Patient]
 *     responses:
 *       200:
 *         description: Successfully created Patient
 *         content:
 *           application/json:
 *             example:
 *               Patient: [{ id: 1, name: "John" }]
 */
router.post('/', PatientController.createPatient);

/**
 * @swagger
 * /Patient:
 *   put:
 *     summary: Update User
 *     tags: [Patient]
 *     responses:
 *       200:
 *         description: Successfully retrieved Patient
 *         content:
 *           application/json:
 *             example:
 *               Patient: [{ id: 1, name: "John" }]
 */
router.put('/:id', PatientController.updatePatient);

/**
 * @swagger
 * /Patient:
 *   delete:
 *     summary: Delete Patient
 *     tags: [Patient]
 *     responses:
 *       200:
 *         description: Successfully created Patient
 *         content:
 *           application/json:
 *             example:
 *               Patient: [{ id: 1, name: "John" }]
 */
router.delete('/:id', PatientController.deletePatient);

export default router;