import { Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';
import { RateLimitService } from '../rate-limit.service';

@Injectable()
export class RateLimitGuard implements CanActivate {
  constructor(private rateLimitService: RateLimitService) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      return true; // Permitir peticiones sin autenticar con límites más bajos
    }

    const plan = user.plan || 'free';
    const endpoint = request.route?.path || request.url;

    // Verificar límite por minuto
    await this.rateLimitService.checkLimit(user.id, plan, endpoint);

    // Verificar límite diario
    await this.rateLimitService.checkDailyLimit(user.id, plan);

    return true;
  }
}