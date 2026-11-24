import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateSubcategories1794851677272 implements MigrationInterface {
    name = 'CreateSubcategories1794851677272'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "subcategories" ("id_subcategory" SERIAL NOT NULL, "code_subcategory" character varying(30) NOT NULL, "name" character varying(100) NOT NULL, "description" text, "id_category" integer NOT NULL, CONSTRAINT "UQ_1549342fe1f21c8bf1ab6e28326" UNIQUE ("code_subcategory"), CONSTRAINT "PK_8148bed735a9a7e5099a938d091" PRIMARY KEY ("id_subcategory"))`);
        await queryRunner.query(`ALTER TABLE "subcategories" ADD CONSTRAINT "FK_0b9984829c2e431f5c27a72e4a3" FOREIGN KEY ("id_category") REFERENCES "categories"("id_category") ON DELETE RESTRICT ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "subcategories" DROP CONSTRAINT "FK_0b9984829c2e431f5c27a72e4a3"`);
        await queryRunner.query(`DROP TABLE "subcategories"`);
    }

}
