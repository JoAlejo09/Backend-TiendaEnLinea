import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUsersAndCustomerProfiles1794890809168 implements MigrationInterface {
    name = 'CreateUsersAndCustomerProfiles1794890809168'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."users_role_enum" AS ENUM('CLIENT', 'ADMIN')`);
        await queryRunner.query(`CREATE TABLE "users" ("id_user" SERIAL NOT NULL, "email" character varying(254) NOT NULL, "password_hash" character varying(255) NOT NULL, "role" "public"."users_role_enum" NOT NULL DEFAULT 'CLIENT', "is_active" boolean NOT NULL DEFAULT true, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_fbb07fa6fbd1d74bee9782fb945" PRIMARY KEY ("id_user"))`);
        await queryRunner.query(`CREATE TABLE "customer_profiles" ("id_user" integer NOT NULL, "first_name" character varying(100) NOT NULL, "last_name" character varying(100) NOT NULL, "identification" character varying(20) NOT NULL, "address" character varying(250) NOT NULL, "phone" character varying(30) NOT NULL, CONSTRAINT "UQ_d86af95d0d1ca6274060d5afe08" UNIQUE ("identification"), CONSTRAINT "PK_bb46048062a2d76cd6c55385147" PRIMARY KEY ("id_user"))`);
        await queryRunner.query(`ALTER TABLE "customer_profiles" ADD CONSTRAINT "FK_bb46048062a2d76cd6c55385147" FOREIGN KEY ("id_user") REFERENCES "users"("id_user") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "customer_profiles" DROP CONSTRAINT "FK_bb46048062a2d76cd6c55385147"`);
        await queryRunner.query(`DROP TABLE "customer_profiles"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
    }

}
