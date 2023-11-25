import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeMessageUUIDName1700937021429 implements MigrationInterface {
    name = 'ChangeMessageUUIDName1700937021429'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "message" RENAME COLUMN "id" TO "messageId"`);
        await queryRunner.query(`ALTER TABLE "message" RENAME CONSTRAINT "PK_ba01f0a3e0123651915008bc578" TO "PK_b664c8ae63d634326ce5896cecc"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "message" RENAME CONSTRAINT "PK_b664c8ae63d634326ce5896cecc" TO "PK_ba01f0a3e0123651915008bc578"`);
        await queryRunner.query(`ALTER TABLE "message" RENAME COLUMN "messageId" TO "id"`);
    }

}
