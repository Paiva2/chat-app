import { MigrationInterface, QueryRunner } from "typeorm";

export class RemovedEmailFromFriendUser1700367522870 implements MigrationInterface {
    name = 'RemovedEmailFromFriendUser1700367522870'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "friend_list" DROP COLUMN "email"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "friend_list" ADD "email" character varying(100) NOT NULL`);
    }

}
