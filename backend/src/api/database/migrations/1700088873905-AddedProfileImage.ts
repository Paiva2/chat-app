import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedProfileImage1700088873905 implements MigrationInterface {
    name = 'AddedProfileImage1700088873905'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "profileImage" character varying(300) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "profileImage"`);
    }

}
