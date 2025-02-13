import { Request, Response } from 'express';
import { User, UserModel } from '../models/User';

export class UserController {

  static async getUserByLoginId(req: Request, res: Response) {
    try {
      const user = await UserModel.findByLoginId(req.body);
      if (!user) return res.status(404).json({ message: 'User not found' });
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  }

  static async getUsers(req: Request, res: Response) {
    try {
      const users = await UserModel.findAll();
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  }

  static async getUserById(req: Request, res: Response) {
    try {
      const user = await UserModel.findById(parseInt(req.params.id));
      if (!user) return res.status(404).json({ message: 'User not found' });
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  }

  static async createUser(req: Request, res: Response) {
    try {

      const newUser = await UserModel.create(req.body);
      
      res.status(201).json(newUser);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create user';
      res.status(500).json({ message });
    }
  }
  
  static async updateUser(req: Request, res: Response) {
    try {
      const updatedUser = await UserModel.update(
        parseInt(req.params.id),
        req.body
      );
      
      res.json(updatedUser);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update user';
      res.status(404).json({ message });
    }
  }

  static async deleteUser(req: Request, res: Response) {
    try {
      const user = await UserModel.findById(parseInt(req.params.id));
      if (!user) return res.status(404).json({ message: 'User not found' });
      
      await UserModel.delete(parseInt(req.params.id));
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  }
}