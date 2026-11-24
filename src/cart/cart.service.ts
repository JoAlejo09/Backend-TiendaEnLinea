import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { DataSource, EntityManager, IsNull } from "typeorm";
import { AddCartItemDto } from "./dto/add-car-item.dto.js";
import { Product } from "../catalog/entities/product.entity.js";
import { User } from "../users/entities/user.entity.js";
import { Cart } from "./entities/cart.entity.js";
import { CartItem } from "./entities/cart-items.entity.js";
import { UpdateCarItemDto } from "./dto/update-car-item.dto.js";
type CartSession={
    userId?:number,
    cartId?:number
}
@Injectable()
export class CartService{
    constructor(
        private readonly dataSource: DataSource
    ){}
    async getOrCreateCart(
        session: CartSession,
        manager: EntityManager
    ): Promise<Cart> {
        const carts = manager.getRepository(Cart);
        let cart: Cart | null = null;
        if (session.userId) {
            cart = await carts.findOne({
                where: {
                    user: { id: session.userId },
                    isActive: true,
                },
            });
        } else if (session.cartId) {
            cart = await carts.findOne({
                where: {
                    id: session.cartId,
                    isActive: true,
                    user: IsNull(),
                },
            });
        }
        if (cart) {
            return cart;
        }
        const newCart = carts.create({
            isActive: true,
            user: session.userId ? { id: session.userId } : null,
        });
        const savedCart = await carts.save(newCart);
        if (!session.userId) {
            session.cartId = savedCart.id;
        }
        return savedCart;
    }

    async addItem(data:AddCartItemDto, 
        session: { userId?:number,
                cartId?:number
        }){
        return this.dataSource.transaction( async (manager)=>{
            const cart = await this.getOrCreateCart(session, manager);
            const products = manager.getRepository(Product)
            const cartItems = manager.getRepository(CartItem)

            const product = await products.findOne({
                where:{
                    id:data.productId,
                    isActive:true
                }
            });
            if (!product) {
                throw new NotFoundException('Producto no encontrado o inactivo');
            }
            const existingItem = await cartItems.findOne({
                where:{
                    cart:{id:cart.id},
                    product:{id:product.id}
                },
            })

            const finalQuantity = (existingItem?.quantity  ?? 0) + data.quantity;
            if (finalQuantity >product.stock){
                throw new BadRequestException('No hay suficiente stock disponible')
            }

            const item = existingItem
                ? Object.assign(existingItem,{quantity:finalQuantity})
                : cartItems.create({
                    cart,
                    product,
                    quantity:finalQuantity
                });
            const savedItem = await cartItems.save(item)
            const unitPrice = Math.round(Number(product.price)*100);
            const subtotal =((unitPrice * savedItem.quantity)).toFixed(2) 
            
            return {
                id: savedItem.id,
                product: {
                    id:product.id,
                    code:product.code,
                    name:product.name,
                    presentation: product.presentation,
                    price: product.price
                },
                quantity: savedItem.quantity,
                subtotal
            }
        })
    } 

    async getCart(session: CartSession){
        const carts = this.dataSource.getRepository(Cart);
        let cart: Cart | null=null;

        if(session.userId){
            cart = await carts.findOne({
                where:{
                    user:{id:session.userId},
                    isActive:true
                }
            });
        }else if(session.cartId){
            cart = await carts.findOne({
                where:{
                    id:session.cartId,
                    isActive:true,
                    user:IsNull()
                }
            })
        }
        if(!cart){
            return{
                items:[],
                total: '0.00'
            }
        };

        const cartItemsData = this.dataSource.getRepository(CartItem);
        const items = await cartItemsData.find({
            where:{
                cart:{id:cart.id}
            },
            relations:{
                product:true,

            }
        })
        const itemsWithSubtotal = items.map((item)=>{
            const unitPrice = Math.round(Number(item.product.price)*100);
            const subtotal = unitPrice * item.quantity;

            return {
                id:item.id,
                product:{
                    id:item.product.id,
                    code: item.product.code,
                    name: item.product.name,
                    presentation: item.product.presentation,
                    price: item.product.price
                },
                quantity: item.quantity,
                subtotal
            };
        });
        const total = itemsWithSubtotal.reduce(
            (sum,item)=> sum+ item.subtotal,
            0,
        );
        return {
            cartId: cart.id,
            items: itemsWithSubtotal.map(({subtotal, ...items})=>({
                ...items,
                subtotalC: (subtotal/100).toFixed(2),
            })),
            totalC:(total/100).toFixed(2)
        }
    }

    async updateItem(itemId:number,
        data:UpdateCarItemDto,
        session:CartSession
    ){
        return this.dataSource.transaction(async (manager)=>{
            const carts = manager.getRepository(Cart);
            const cartItems = manager.getRepository(CartItem);

            const cart = await carts.findOne({
                where:{
                    id:session.cartId,
                    isActive:true
                },
                relations:{
                    items:true
                }
            });
            if(!cart){
                throw new NotFoundException('No existe un carrito activo');
   
           }
            const item = await cartItems.findOne({
                where:{
                    id:itemId,
                    cart:{id:cart.id}
                },
                relations:{
                    product:true
                }
            })

            if(!item){
                throw new  NotFoundException('No existe el producto')
            }

            if(data.quantity > item.product?.stock){
                throw new BadRequestException('No hay la cantidad de productos seleccionados ')
            }
            item.quantity = data.quantity;
            const savedItem = await cartItems.save(item);
            const unitPrice = Math.round(Number(item.product.price)*100);
            const subtotal =((unitPrice * savedItem.quantity)).toFixed(2) 
            
            return {
                id: savedItem.id,
                product: {
                    id:item.product.id,
                    code:item.product.code,
                    name:item.product.name,
                    presentation: item.product.presentation,
                    price: item.product.price
                },
                quantity: savedItem.quantity,
                subtotal
            }
        })
    }

    async removeItem(itemId:number, session:CartSession){
        return this.dataSource.transaction(async (manager)=>{
            const carts = manager.getRepository(Cart)
            const cartItems = manager.getRepository(CartItem)
            
            let cart: Cart | null=null;
            if(session.userId){
                cart = await carts.findOne({
                    where:{
                        user:{id:session.userId},
                        isActive:true
                    }
                })
            }else if(session.cartId){
                cart = await carts.findOne({
                    where:{
                        id:session.cartId,
                        isActive:true,
                        user:IsNull()
                    }
                })
            }
            if(!cart){
                throw new NotFoundException('No existe un carrito activo');
            }
            const item = await cartItems.findOne({
                where:{
                    id:itemId,
                    cart:{id: cart.id}
                }
            })
            if(!item){
                throw new NotFoundException('El ítem no existe en este carrito');
            }
            await cartItems.remove(item);
            return{ message:'El item ha sido eliminado', itemId};
        });
    }

    async mergeGuestCart(
        userId:number,
        session:CartSession,
    ):Promise<void>{
        if(!session.cartId){
            return;
        }
        return this.dataSource.transaction(async (manager)=>{
            const carts = manager.getRepository(Cart);
            const cartItems = manager.getRepository(CartItem);
            const guestCart = await carts.findOne({
                where:{
                    id:session.cartId,
                    isActive:true,
                    user:IsNull()
                },
                relations:{
                    items:{
                        product:true
                    }
                }
            });
            
            if(!guestCart){
                session.cartId = undefined;
                return;
            }

            const userCart = await carts.findOne({
                where:{
                    user:{id:userId},
                    isActive:true,
                },
                relations:{
                    items:{
                        product:true,
                    }
                }
            });

            const users= manager.getRepository(User)
            const user = await users.findOneBy({
                id:userId,
                isActive:true
            });

            if(!user){
                throw new NotFoundException('Usuario no encontrado o inactivo');
            }
            if(!userCart){
                guestCart.user = user;
                await carts.save(guestCart);
                session.cartId = guestCart.id;
                return
            }
            for(const guestItem of guestCart.items){
                const matchingItem = userCart.items.find(
                    (userItem)=> userItem.product.id === guestItem.product.id
                );
                if(matchingItem){
                    matchingItem.quantity + guestItem.quantity
                    await cartItems.save(matchingItem)
                    await cartItems.remove(guestItem)
                }else{
                    guestItem.cart = userCart;
                    await cartItems.save(guestItem)
                }
            }
            guestCart.isActive = false;
            await carts.save(guestCart)
            session.cartId = userCart.id
        })
    }
}