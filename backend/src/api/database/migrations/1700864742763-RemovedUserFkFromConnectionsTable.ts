import { MigrationInterface, QueryRunner } from "typeorm";

export class RemovedUserFkFromConnectionsTable1700864742763 implements MigrationInterface {
    name = 'RemovedUserFkFromConnectionsTable1700864742763'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "connections" DROP CONSTRAINT "FK_a9b3e529a600fb7619ad3c45b69"`);
        await queryRunner.query(`ALTER TABLE "connections" DROP COLUMN "fkUser"`);
        await queryRunner.query(`ALTER TABLE "connections" ADD "fkUser" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "connections" DROP COLUMN "fkUser"`);
        await queryRunner.query(`ALTER TABLE "connections" ADD "fkUser" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "connections" ADD CONSTRAINT "FK_a9b3e529a600fb7619ad3c45b69" FOREIGN KEY ("fkUser") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
