import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { UserRepository } from '../repositories/user.repository';

export class UserController {
  private userRepo: UserRepository;

  constructor() {
    this.userRepo = new UserRepository();
  }

  getAllUsers = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const users = await this.userRepo.findAll();
      res.status(200).json(users);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };
}

