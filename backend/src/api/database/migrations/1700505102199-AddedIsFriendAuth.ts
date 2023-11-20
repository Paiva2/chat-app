import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedIsFriendAuth1700505102199 implements MigrationInterface {
    name = 'AddedIsFriendAuth1700505102199'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_friend" ADD "isAuth" boolean NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_friend" DROP COLUMN "isAuth"`);
    }

}
