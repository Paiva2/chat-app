import { MigrationInterface, QueryRunner } from "typeorm";

export class RevertChanges1700426550767 implements MigrationInterface {
    name = 'RevertChanges1700426550767'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_friend" DROP CONSTRAINT "FK_c5146a681e46ee7ac4f3e7b066f"`);
        await queryRunner.query(`ALTER TABLE "user_friend" ADD CONSTRAINT "FK_c5146a681e46ee7ac4f3e7b066f" FOREIGN KEY ("fkUserId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_friend" DROP CONSTRAINT "FK_c5146a681e46ee7ac4f3e7b066f"`);
        await queryRunner.query(`ALTER TABLE "user_friend" ADD CONSTRAINT "FK_c5146a681e46ee7ac4f3e7b066f" FOREIGN KEY ("fkUserId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
