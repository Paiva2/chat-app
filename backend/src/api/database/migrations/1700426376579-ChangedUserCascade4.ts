import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangedUserCascade41700426376579 implements MigrationInterface {
    name = 'ChangedUserCascade41700426376579'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_friend" DROP CONSTRAINT "FK_c5146a681e46ee7ac4f3e7b066f"`);
        await queryRunner.query(`ALTER TABLE "user_friend" DROP COLUMN "username"`);
        await queryRunner.query(`ALTER TABLE "user_friend" ADD "username" character varying(200) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "username"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "username" character varying(200) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user_friend" ADD CONSTRAINT "FK_c5146a681e46ee7ac4f3e7b066f" FOREIGN KEY ("fkUserId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_friend" DROP CONSTRAINT "FK_c5146a681e46ee7ac4f3e7b066f"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "username"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "username" character varying(100) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user_friend" DROP COLUMN "username"`);
        await queryRunner.query(`ALTER TABLE "user_friend" ADD "username" character varying(100) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user_friend" ADD CONSTRAINT "FK_c5146a681e46ee7ac4f3e7b066f" FOREIGN KEY ("fkUserId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
