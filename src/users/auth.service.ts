import { Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./entities/user.entity.js";
import { Repository } from "typeorm";
import { LoginDto } from "./dto/login.dto.js";
import * as argon2 from 'argon2';
import { profile } from "console";

@Injectable()
export class AuthService{
    constructor(
        @InjectRepository(User)
        private readonly users:Repository<User>
    ){}

    async validateCredentials(data: LoginDto){
        const user = await this.users.findOne({
            where:{email:data.email},
            relations: {profile:true}
        });

        if(!user){
            throw new UnauthorizedException('Credenciales inválidas')
        }
        const verifyPassword = await argon2.verify(user.passwordHash, data.password)

        if(!verifyPassword){
            throw new UnauthorizedException('Credenciales inválidas')
        }
        if(! user.isActive){
            throw new UnauthorizedException('El usuario no se encuentra activo')
        }
        return {
            id: user.id,
            email: user.email,
            role: user.role,
            profile: user.profile
            ?{
                firstName: user.profile.firstName,
                lastName: user.profile.lastName
            }
            : null,
        }
    }

    async getCurrentUser(userId:number){
        const user = await this.users.findOne({
            where: {id:userId},
            relations:{profile:true}
        });
        if(!user){
            throw new UnauthorizedException('No existe el usuario')
        }
        if(!user.isActive){
            throw new UnauthorizedException('Usuario no activo')            
        }
        return{
            id: user.id,
            email: user.email,
            role: user.role,
            profile:user.profile
            ? {
                firstName: user.profile?.firstName,
                lastName: user.profile?.lastName
            }
            : null,
        }
    }
}