import { Body, Controller, Get, HttpCode, InternalServerErrorException, Post, Res, Session, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service.js";
import { LoginDto } from "./dto/login.dto.js";
import { AuthGuard } from "./auth.guard.js";
import { CartService } from "../cart/cart.service.js";
import type { Session as ExpressSession } from "express-session";
import type { Response } from 'express';

@Controller('auth')
export class AuthController{
    constructor(private readonly auth:AuthService,
        private readonly cart:CartService
    ){}

    @Post('login')
    @HttpCode(200)
    async login(@Body() data: LoginDto,
    @Session() session: { userId?: number}
    ){
         const user = await this.auth.validateCredentials(data)
         await this.cart.mergeGuestCart(user.id, session)
         session.userId = user.id;
         return user
    }

    @Get('me')
    @UseGuards(AuthGuard)
    getMe(@Session() session:{userId: number}){
        return this.auth.getCurrentUser(session.userId);
    }

    @Post('logout')
    @UseGuards(AuthGuard)
    @HttpCode(200)
    async logout(
        @Session() session: ExpressSession,
        @Res({passthrough:true}) response: Response
    ){
        await new Promise<void>((resolve, reject)=>{
            session.destroy((error)=>{
                if(error){
                    reject(new InternalServerErrorException('No se pudo cerrar la sesión'))
                    return;
                }
                resolve();
            })
        });

        response.clearCookie('connect.sid',{
            path:'/',
            httpOnly:true,
            secure:false,
            sameSite:'lax'
        });

        return {
            message:'Sesion cerrada correctamente'
        }
    }
}