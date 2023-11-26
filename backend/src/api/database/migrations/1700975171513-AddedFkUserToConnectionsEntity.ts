import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedFkUserToConnectionsEntity1700975171513 implements MigrationInterface {
    name = 'AddedFkUserToConnectionsEntity1700975171513'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "connections" ADD "fkUser" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "connections" ADD CONSTRAINT "FK_a9b3e529a600fb7619ad3c45b69" FOREIGN KEY ("fkUser") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "connections" DROP CONSTRAINT "FK_a9b3e529a600fb7619ad3c45b69"`);
        await queryRunner.query(`ALTER TABLE "connections" DROP COLUMN "fkUser"`);
    }

}
