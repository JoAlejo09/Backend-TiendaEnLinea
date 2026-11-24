import { ConflictException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User, UserRole } from "./entities/user.entity.js";
import { DataSource, Repository } from "typeorm";
import { CustomerProfile } from "./entities/customer-profile.entity.js";
import { RegisterCustomerDto } from "./dto/register-customer.dto.js";
import * as argon2 from 'argon2';


@Injectable()
export class UsersService{
    constructor(
        @InjectRepository(User)
        private readonly users: Repository<User>,

        @InjectRepository(CustomerProfile)
        private readonly customerProfiles: Repository<CustomerProfile>,
        
        private readonly dataSource: DataSource
    ){}

    async registerCustomer(data: RegisterCustomerDto){
        const email = await this.users.findOneBy({email:data.email})

        if(email){
            throw new ConflictException('El email ya se encuentra registrado con otro usuario')
        }

        const id = await this.customerProfiles.findOneBy({identification: data.identification})

        if(id){
            throw new ConflictException('Ya se encuentra registrada esta identificacion')
        }
        const passwordHash = await argon2.hash(data.password);
        return this.dataSource.transaction(async (manager)=>{
            const users = manager.getRepository(User);
            const profiles = manager.getRepository(CustomerProfile);
            
            const user  = users.create({
                email: data.email,
                passwordHash,
                role: UserRole.CLIENT
            })
            const savedUser = await users.save(user);

            const profile = profiles.create({
                firstName: data.firstName,
                lastName: data.lastName,
                identification: data.identification,
                address: data.address,
                phone:data.phone,
                user: savedUser,
        })
            await profiles.save(profile);
            return {
              id: savedUser.id,
                email: savedUser.email,
                role: savedUser.role,
                profile: {
                    firstName: profile.firstName,
                    lastName: profile.lastName,
                    identification: profile.identification,
                    address: profile.address,
                    phone: profile.phone,
                },
            };
        });
    }
}