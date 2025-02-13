import { Request, Response } from 'express';
import { User, UserModel } from '../models/User';

export class UserController {
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
      const { username, password_hash, email, role_id, created_at, updated_at } = req.body;
      if (!username || !password_hash) {
        return res.status(400).json({ message: 'username and password are required' });
      }
      
      const newUser = await UserModel.create({ 
        username, 
        password_hash,
        email,
        role_id,
        created_at,
        updated_at
      });
      
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
      const task = await UserModel.findById(parseInt(req.params.id));
      if (!task) return res.status(404).json({ message: 'User not found' });
      
      await UserModel.delete(parseInt(req.params.id));
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  }
}