import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { Observable } from "rxjs";
import { Reflector } from "@nestjs/core";
import { Role } from "../enums";


@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {
  }

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>("roles", [context.getHandler(), context.getClass()]);
    if (!requiredRoles) return true;
    const { user } = context.switchToHttp().getRequest();
    const isValidRole = requiredRoles.some((role) => user.role.includes(role));
    if (!isValidRole) throw new UnauthorizedException("You don't have permissions to perform this action");
    return true;
  }
}
