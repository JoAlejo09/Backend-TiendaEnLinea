import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";

@Injectable()
export class AuthGuard implements CanActivate{
    canActivate(context: ExecutionContext): boolean{
        const request = context.switchToHttp().getRequest<{
            session?: { userId?:number}
        }>();
        const userId = request.session?.userId;
        if(!userId){
            throw new UnauthorizedException('Debes iniciar sesión');
        }
        return true;        
    }

}