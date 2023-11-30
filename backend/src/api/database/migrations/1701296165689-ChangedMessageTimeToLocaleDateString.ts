import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangedMessageTimeToLocaleDateString1701296165689 implements MigrationInterface {
    name = 'ChangedMessageTimeToLocaleDateString1701296165689'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "message" DROP COLUMN "time"`);
        await queryRunner.query(`ALTER TABLE "message" ADD "time" character varying(100) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "message" DROP COLUMN "time"`);
        await queryRunner.query(`ALTER TABLE "message" ADD "time" TIMESTAMP NOT NULL DEFAULT now()`);
    }

}
