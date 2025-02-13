import { Request, Response } from 'express';
import { Patient, PatientModel } from '../models/Patient';

export class PatientController {
  static async getPatients(req: Request, res: Response) {
    try {
      const Patients = await PatientModel.findAll();
      res.json(Patients);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  }

  static async getPatientById(req: Request, res: Response) {
    try {
      const patient = await PatientModel.findById(parseInt(req.params.id));
      if (!patient) return res.status(404).json({ message: 'Patient not found' });
      res.json(patient);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  }

  static async createPatient(req: Request, res: Response) {
    try {    
      
      const newPatient = await PatientModel.create(req.body);      
      res.status(201).json(newPatient);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create patient';
      res.status(500).json({ message });
    }
  }
  
  static async updatePatient(req: Request, res: Response) {
    try {
      const updatedPatient = await PatientModel.update(
        parseInt(req.params.id),
        req.body
      );
      
      res.json(updatedPatient);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update patient';
      res.status(404).json({ message });
    }
  }

  static async deletePatient(req: Request, res: Response) {
    try {
      const task = await PatientModel.findById(parseInt(req.params.id));
      if (!task) return res.status(404).json({ message: 'User not found' });
      
      await PatientModel.delete(parseInt(req.params.id));
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  }
}