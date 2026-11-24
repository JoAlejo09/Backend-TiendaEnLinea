import { MigrationInterface, QueryRunner } from "typeorm";

export class CreatePayment1795486004658 implements MigrationInterface {
    name = 'CreatePayment1795486004658'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."payment_status_enum" AS ENUM('PENDIENTE', 'APROBADO', 'RECHAZADO')`);
        await queryRunner.query(`CREATE TYPE "public"."payment_method_enum" AS ENUM('TARJETA_SIMULADA')`);
        await queryRunner.query(`CREATE TABLE "payment" ("id_payment" SERIAL NOT NULL, "status" "public"."payment_status_enum" NOT NULL DEFAULT 'PENDIENTE', "method" "public"."payment_method_enum" NOT NULL DEFAULT 'TARJETA_SIMULADA', "amount" numeric(10,2) NOT NULL, "transaction_reference" character varying(30) NOT NULL, "failure_reason" text, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "processed_at" TIMESTAMP WITH TIME ZONE, "id_order" integer, CONSTRAINT "REL_ae123244ceb961a4163838c5a3" UNIQUE ("id_order"), CONSTRAINT "PK_49d32119980bcb196e94debc25c" PRIMARY KEY ("id_payment"))`);
        await queryRunner.query(`ALTER TABLE "payment" ADD CONSTRAINT "FK_ae123244ceb961a4163838c5a36" FOREIGN KEY ("id_order") REFERENCES "orders"("id_order") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "payment" DROP CONSTRAINT "FK_ae123244ceb961a4163838c5a36"`);
        await queryRunner.query(`DROP TABLE "payment"`);
        await queryRunner.query(`DROP TYPE "public"."payment_method_enum"`);
        await queryRunner.query(`DROP TYPE "public"."payment_status_enum"`);
    }

}
