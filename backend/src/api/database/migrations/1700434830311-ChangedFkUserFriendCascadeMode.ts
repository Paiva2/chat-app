import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangedFkUserFriendCascadeMode1700434830311 implements MigrationInterface {
    name = 'ChangedFkUserFriendCascadeMode1700434830311'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_friend" DROP CONSTRAINT "FK_945215a8022c07179c5183dc825"`);
        await queryRunner.query(`ALTER TABLE "user_friend" ADD CONSTRAINT "FK_945215a8022c07179c5183dc825" FOREIGN KEY ("fkUser") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_friend" DROP CONSTRAINT "FK_945215a8022c07179c5183dc825"`);
        await queryRunner.query(`ALTER TABLE "user_friend" ADD CONSTRAINT "FK_945215a8022c07179c5183dc825" FOREIGN KEY ("fkUser") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
