import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangedFriendAuthPropertyName1700505916786 implements MigrationInterface {
    name = 'ChangedFriendAuthPropertyName1700505916786'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_friend" RENAME COLUMN "isAuth" TO "auth"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_friend" RENAME COLUMN "auth" TO "isAuth"`);
    }

}
