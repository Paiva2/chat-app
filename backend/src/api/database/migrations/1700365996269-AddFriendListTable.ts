import { MigrationInterface, QueryRunner } from "typeorm";

export class AddFriendListTable1700365996269 implements MigrationInterface {
    name = 'AddFriendListTable1700365996269'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "friend_list" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "username" character varying(100) NOT NULL, "email" character varying(100) NOT NULL, "profileImage" character varying(300) NOT NULL, "addedAt" TIMESTAMP NOT NULL DEFAULT NOW(), "fkUserId" uuid, CONSTRAINT "PK_2e2f53fdfb181a93b04f979c4a3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "friend_list" ADD CONSTRAINT "FK_a8d429bba795910e983fff9f66c" FOREIGN KEY ("fkUserId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "friend_list" DROP CONSTRAINT "FK_a8d429bba795910e983fff9f66c"`);
        await queryRunner.query(`DROP TABLE "friend_list"`);
    }

}
