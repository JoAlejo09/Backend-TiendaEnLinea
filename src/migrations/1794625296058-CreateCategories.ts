import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateCategories1794625296058 implements MigrationInterface {
    name = 'CreateCategories1794625296058'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "categories" ("id_category" SERIAL NOT NULL, "code_category" character varying(30) NOT NULL, "name" character varying(100) NOT NULL, "description" text, CONSTRAINT "UQ_7ff45c07166aa66f87b75b783ca" UNIQUE ("code_category"), CONSTRAINT "PK_8ac255b9743120147e61fb5465b" PRIMARY KEY ("id_category"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "categories"`);
    }

}
