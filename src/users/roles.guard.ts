import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AuthService } from "./auth.service.js";
import type { UserRole } from "./entities/user.entity.js";
import { ROLES_KEY } from "./decorators/roles.decorators.js";

@Injectable()
export class RolesGuard implements CanActivate{
    constructor(private readonly reflector: Reflector,
        private readonly auth: AuthService
    ){

    }
    async canActivate(context: ExecutionContext): Promise<boolean>{
        const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
            ROLES_KEY,
            [context.getHandler(), context.getClass()],
        ) ;
        if (!requiredRoles?.length){
            return true;
        }
        const request = context.switchToHttp().getRequest<{
            session?: { userId?:number};
        }>();

        const userId = request.session?.userId;
        if(!userId){
            throw new UnauthorizedException('Debes iniciar sesión');
        }
        const user = await this.auth.getCurrentUser(userId)
        if(!requiredRoles.includes(user.role)){
            throw new ForbiddenException('No tienes permisos para acceder a este recurso')
        }
        return true;
    }
}