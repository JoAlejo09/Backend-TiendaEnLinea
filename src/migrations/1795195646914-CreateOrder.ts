import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateOrder1795195646914 implements MigrationInterface {
    name = 'CreateOrder1795195646914'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."orders_status_enum" AS ENUM('PENDIENTE', 'PAGADO', 'CANCELADO')`);
        await queryRunner.query(`CREATE TYPE "public"."orders_fulfillmenttype_enum" AS ENUM('DOMICILIO', 'RETIRO')`);
        await queryRunner.query(`CREATE TABLE "orders" ("id_order" SERIAL NOT NULL, "order_code" character varying(30) NOT NULL, "status" "public"."orders_status_enum" NOT NULL DEFAULT 'PENDIENTE', "fulfillmentType" "public"."orders_fulfillmenttype_enum" NOT NULL, "delivery_address" text, "subtotal" numeric(10,2) NOT NULL, "deliveryCost" numeric(10,2) NOT NULL, "total" numeric(10,2) NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "id_user" integer NOT NULL, CONSTRAINT "UQ_e462c2f2237b3049aa6be3fce06" UNIQUE ("order_code"), CONSTRAINT "PK_cedeac4ffe8ca857395059cf954" PRIMARY KEY ("id_order"))`);
        await queryRunner.query(`CREATE TABLE "order_items" ("id_order_item" SERIAL NOT NULL, "product_code" character varying(30) NOT NULL, "product_name" character varying(120) NOT NULL, "product_presentation" character varying(30) NOT NULL, "unit_price" numeric(10,2) NOT NULL, "quantity" integer NOT NULL, "subtotal" numeric(10,2) NOT NULL, "id_order" integer NOT NULL, "id_product" integer NOT NULL, CONSTRAINT "CHK_quantity_positive" CHECK (quantity > 0), CONSTRAINT "PK_3ba9feb6631b553ef1e2ea77d23" PRIMARY KEY ("id_order_item"))`);
        await queryRunner.query(`ALTER TABLE "orders" ADD CONSTRAINT "FK_cd5ab3545a6a927f97dd839dd96" FOREIGN KEY ("id_user") REFERENCES "users"("id_user") ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order_items" ADD CONSTRAINT "FK_fbddc49a7daaaec66575fe22ca2" FOREIGN KEY ("id_order") REFERENCES "orders"("id_order") ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order_items" ADD CONSTRAINT "FK_0f2400a3ab4516d6c69581ebf95" FOREIGN KEY ("id_product") REFERENCES "products"("id_product") ON DELETE RESTRICT ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order_items" DROP CONSTRAINT "FK_0f2400a3ab4516d6c69581ebf95"`);
        await queryRunner.query(`ALTER TABLE "order_items" DROP CONSTRAINT "FK_fbddc49a7daaaec66575fe22ca2"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP CONSTRAINT "FK_cd5ab3545a6a927f97dd839dd96"`);
        await queryRunner.query(`DROP TABLE "order_items"`);
        await queryRunner.query(`DROP TABLE "orders"`);
        await queryRunner.query(`DROP TYPE "public"."orders_fulfillmenttype_enum"`);
        await queryRunner.query(`DROP TYPE "public"."orders_status_enum"`);
    }

}
