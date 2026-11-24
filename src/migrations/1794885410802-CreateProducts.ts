import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateProducts1794885410802 implements MigrationInterface {
    name = 'CreateProducts1794885410802'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "products" ("id_product" SERIAL NOT NULL, "code_product" character varying(30) NOT NULL, "name" character varying(150) NOT NULL, "brand" character varying(100) NOT NULL, "characteristics" character varying, "presentation" character varying(100) NOT NULL, "price" numeric(10,2) NOT NULL, "stock" integer NOT NULL DEFAULT '0', "description" text, "id_subcategory" integer NOT NULL, CONSTRAINT "UQ_a04b50fc39fbb27c64d43009c7a" UNIQUE ("code_product"), CONSTRAINT "CHK_products_stock_non_negative" CHECK ("stock" >= 0), CONSTRAINT "CHK_products_price_positive" CHECK ("price" > 0), CONSTRAINT "PK_61a11191b5789c8a8035edf88f7" PRIMARY KEY ("id_product"))`);
        await queryRunner.query(`ALTER TABLE "products" ADD CONSTRAINT "FK_94aaa029064326a05a26b599c30" FOREIGN KEY ("id_subcategory") REFERENCES "subcategories"("id_subcategory") ON DELETE RESTRICT ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" DROP CONSTRAINT "FK_94aaa029064326a05a26b599c30"`);
        await queryRunner.query(`DROP TABLE "products"`);
    }

}
