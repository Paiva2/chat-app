import { MigrationInterface, QueryRunner } from "typeorm"

export class ChangedUserFriendFkType1700425720179 implements MigrationInterface {
  name = "ChangedUserFriendFkType1700425720179"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user_friend" DROP COLUMN "username"`)
    await queryRunner.query(
      `ALTER TABLE "user_friend" ADD "username" character varying(200) NOT NULL`
    )
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "username"`)
    await queryRunner.query(
      `ALTER TABLE "user" ADD "username" character varying(200) NOT NULL`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "username"`)
    await queryRunner.query(
      `ALTER TABLE "user" ADD "username" character varying(100) NOT NULL`
    )
    await queryRunner.query(`ALTER TABLE "user_friend" DROP COLUMN "username"`)
    await queryRunner.query(
      `ALTER TABLE "user_friend" ADD "username" character varying(100) NOT NULL`
    )
  }
}
