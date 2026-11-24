import { MigrationInterface, QueryRunner } from "typeorm";

export class AddProductActiveFlag1794888381772 implements MigrationInterface {
    name = 'AddProductActiveFlag1794888381772'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" ADD "is_active" boolean NOT NULL DEFAULT true`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "is_active"`);
    }

}
