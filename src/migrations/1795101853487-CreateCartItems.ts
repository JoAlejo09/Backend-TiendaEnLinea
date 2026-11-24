import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateCartItems1795101853487 implements MigrationInterface {
    name = 'CreateCartItems1795101853487'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "carts" ("id_cart" SERIAL NOT NULL, "is_active" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "modified_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "id_user" integer, CONSTRAINT "PK_eae83d608f1bddb0211f33f5bbc" PRIMARY KEY ("id_cart"))`);
        await queryRunner.query(`CREATE TABLE "cart_items" ("id_cart_item" SERIAL NOT NULL, "quantity" integer NOT NULL, "id_cart" integer NOT NULL, "id_product" integer NOT NULL, CONSTRAINT "UQ_cart_items_product" UNIQUE ("id_cart", "id_product"), CONSTRAINT "PK_73da45dd65cdf3afb91e76b18c9" PRIMARY KEY ("id_cart_item"))`);
        await queryRunner.query(`ALTER TABLE "carts" ADD CONSTRAINT "FK_7751e46633ff470dca0b5496f5f" FOREIGN KEY ("id_user") REFERENCES "users"("id_user") ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "cart_items" ADD CONSTRAINT "FK_efad0500a672adfd95db60da9ba" FOREIGN KEY ("id_cart") REFERENCES "carts"("id_cart") ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "cart_items" ADD CONSTRAINT "FK_941f42180e88094cbb8ca2f4a51" FOREIGN KEY ("id_product") REFERENCES "products"("id_product") ON DELETE RESTRICT ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cart_items" DROP CONSTRAINT "FK_941f42180e88094cbb8ca2f4a51"`);
        await queryRunner.query(`ALTER TABLE "cart_items" DROP CONSTRAINT "FK_efad0500a672adfd95db60da9ba"`);
        await queryRunner.query(`ALTER TABLE "carts" DROP CONSTRAINT "FK_7751e46633ff470dca0b5496f5f"`);
        await queryRunner.query(`DROP TABLE "cart_items"`);
        await queryRunner.query(`DROP TABLE "carts"`);
    }

}
