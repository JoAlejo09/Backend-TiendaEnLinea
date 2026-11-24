import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateInvoice1795535737368 implements MigrationInterface {
    name = 'CreateInvoice1795535737368'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "invoice" ("id_invoice" SERIAL NOT NULL, "invoice_number" character varying(30) NOT NULL, "customer_name" character varying(100) NOT NULL, "customer_last_name" character varying(100) NOT NULL, "identification" character varying(20) NOT NULL, "billing_address" character varying(250) NOT NULL, "phone" character varying(30) NOT NULL, "issued_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "id_order" integer NOT NULL, CONSTRAINT "UQ_c7ec75a1a4068196ea74b920df9" UNIQUE ("invoice_number"), CONSTRAINT "REL_0a285c193fc6bef5fd0039c150" UNIQUE ("id_order"), CONSTRAINT "PK_2bd284e3708be20e170e2464607" PRIMARY KEY ("id_invoice"))`);
        await queryRunner.query(`ALTER TABLE "invoice" ADD CONSTRAINT "FK_0a285c193fc6bef5fd0039c1500" FOREIGN KEY ("id_order") REFERENCES "orders"("id_order") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "invoice" DROP CONSTRAINT "FK_0a285c193fc6bef5fd0039c1500"`);
        await queryRunner.query(`DROP TABLE "invoice"`);
    }

}
