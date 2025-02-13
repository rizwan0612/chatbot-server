import pool from '../config/database';

export interface User {
  id?: number;
  username: string;
  password_hash: string;
  email: boolean;
  role_id: number;
  created_at?: Date;
  updated_at?: Date;
}

export class UserModel {
    static async findAll(): Promise<User[]> {
      const [rows] = await pool.query('SELECT * FROM user');
      return rows as User[];
    }
  
    static async findById(id: number): Promise<User | null> {
      const [rows] = await pool.query('SELECT * FROM user WHERE user_id = ?', [id]);
      return (rows as User[])[0] || null;
    }
  
    static async create(user: User): Promise<User> {
      const [result] = await pool.query(
        'INSERT INTO user (username, password_hash, email,role_id,created_at,updated_at) VALUES (?, ?, ?, ?, ?, ?)',
        [user.username, user.password_hash, user.email, user.role_id, user.created_at, user.updated_at]
      );
      
      // Handle potential null with type assertion
      const createdUser = await this.findById((result as any).insertId);
      if (!createdUser) {
        throw new Error('Failed to create task');
      }
      
      return createdUser;
    }
  
    static async update(id: number, user: User): Promise<User> {
      await pool.query(
        'UPDATE user SET username = ?, password_hash = ?, email = ?, role_id = ?, updated_at = ? WHERE user_id = ?',
        [user.username, user.password_hash, user.email, user.role_id, user.updated_at, user.id]
      );
      
      const updatedUser = await this.findById(id);
      if (!updatedUser) {
        throw new Error('User not found after update');
      }
      
      return updatedUser;
    }
  
    static async delete(id: number): Promise<void> {
      await pool.query('DELETE FROM user WHERE user_id = ?', [id]);
    }
  }