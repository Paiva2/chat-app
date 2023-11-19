import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangedFkTypeOnUserFriend1700429540816 implements MigrationInterface {
    name = 'ChangedFkTypeOnUserFriend1700429540816'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_friend" DROP CONSTRAINT "FK_945215a8022c07179c5183dc825"`);
        await queryRunner.query(`ALTER TABLE "user_friend" ALTER COLUMN "fkUser" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user_friend" ADD CONSTRAINT "FK_945215a8022c07179c5183dc825" FOREIGN KEY ("fkUser") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_friend" DROP CONSTRAINT "FK_945215a8022c07179c5183dc825"`);
        await queryRunner.query(`ALTER TABLE "user_friend" ALTER COLUMN "fkUser" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user_friend" ADD CONSTRAINT "FK_945215a8022c07179c5183dc825" FOREIGN KEY ("fkUser") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
