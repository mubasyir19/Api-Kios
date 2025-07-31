import { NextFunction, Request, Response } from 'express';
import { authService } from '../services/auth.service';
import { ResponseUtil } from '../utils/response';

class AuthController {
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const dataUser = req.body;
      const handleLogin = await authService.login(dataUser);

      res.status(200).json(
        ResponseUtil.success({
          id: handleLogin.user.id,
          fullname: handleLogin.user.fullname,
          email: handleLogin.user.email,
          username: handleLogin.user.username,
          phoneNumber: handleLogin.user.phoneNumber,
          role: handleLogin.user.role,
        })
      );
    } catch (error) {
      next(error);
    }
  }

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
