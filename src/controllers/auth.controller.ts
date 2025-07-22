import { NextFunction, Request, Response } from 'express';
import { authService } from '../services/auth.service';
import { ResponseUtil } from '../utils/response';

class AuthController {
  async login() {}
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const dataUser = req.body;
      const result = await authService.register(dataUser);

      res.status(201).json(ResponseUtil.success(result, 'Success create an account'));
    } catch (error) {
      next(error);
    }
  }
}

export const authController = new AuthController();
