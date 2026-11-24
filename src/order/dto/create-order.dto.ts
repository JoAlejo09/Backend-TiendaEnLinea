import { IsEnum, IsString, Length, ValidateIf } from "class-validator";
import { FulfillmentType } from "../entities/order.entity.js";

export class CreateOrderDto{
    @IsEnum(FulfillmentType)
    fulfillmentType!: FulfillmentType

    @ValidateIf((dto)=> dto.fulfillmentType === FulfillmentType.DOMICILIO)
    @IsString()
    @Length(1,250)
    deliveryAddress?: string;
}