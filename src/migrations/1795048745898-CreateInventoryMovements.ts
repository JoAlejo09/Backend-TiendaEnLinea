import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateInventoryMovements1795048745898 implements MigrationInterface {
    name = 'CreateInventoryMovements1795048745898'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."inventory_movements_reason_enum" AS ENUM('REPOSICION', 'VENTA', 'AJUSTE', 'DEVOLUCION')`);
        await queryRunner.query(`CREATE TABLE "inventory_movements" ("id_movement" SERIAL NOT NULL, "reason" "public"."inventory_movements_reason_enum" NOT NULL, "quantityChange" integer NOT NULL, "stockBefore" integer NOT NULL, "stockAfter" integer NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "id_product" integer NOT NULL, "id_user" integer NOT NULL, CONSTRAINT "CHK_inventory_movement_stock_consistent" CHECK ("stockAfter" = "stockBefore" + "quantityChange"), CONSTRAINT "CHK_inventory_movement_stock_nonnegative" CHECK ("stockBefore" >= 0 AND "stockAfter" >= 0), CONSTRAINT "CHK_inventory_movement_quantity_change_nonzero" CHECK ("quantityChange" <> 0), CONSTRAINT "PK_b2bbc523a9318158dbf4ddcc4eb" PRIMARY KEY ("id_movement"))`);
        await queryRunner.query(`ALTER TABLE "inventory_movements" ADD CONSTRAINT "FK_8261b1f0fc79ed1844ff8b7e41a" FOREIGN KEY ("id_product") REFERENCES "products"("id_product") ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "inventory_movements" ADD CONSTRAINT "FK_871425bcbab53dc46a8fb3f06d2" FOREIGN KEY ("id_user") REFERENCES "users"("id_user") ON DELETE RESTRICT ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "inventory_movements" DROP CONSTRAINT "FK_871425bcbab53dc46a8fb3f06d2"`);
        await queryRunner.query(`ALTER TABLE "inventory_movements" DROP CONSTRAINT "FK_8261b1f0fc79ed1844ff8b7e41a"`);
        await queryRunner.query(`DROP TABLE "inventory_movements"`);
        await queryRunner.query(`DROP TYPE "public"."inventory_movements_reason_enum"`);
    }

}
