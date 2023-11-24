import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedConnectionsColumnAndMessagesColumn1700863425968 implements MigrationInterface {
    name = 'AddedConnectionsColumnAndMessagesColumn1700863425968'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "message" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "message" character varying(500) NOT NULL, "sendToId" character varying(200) NOT NULL, "sendToUsername" character varying(100) NOT NULL, "time" TIMESTAMP NOT NULL DEFAULT NOW(), "type" character varying(100) NOT NULL, "userId" character varying(100) NOT NULL, "userProfilePic" character varying(200) NOT NULL, "username" character varying(200) NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(), "fkConnections" uuid NOT NULL, CONSTRAINT "PK_ba01f0a3e0123651915008bc578" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "connections" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "connectionOne" character varying(200) NOT NULL, "connectionTwo" character varying(200) NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(), "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW(), "fkUser" uuid NOT NULL, CONSTRAINT "PK_0a1f844af3122354cbd487a8d03" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "message" ADD CONSTRAINT "FK_0381f14f34f862237dfd4a2c4dd" FOREIGN KEY ("fkConnections") REFERENCES "connections"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "connections" ADD CONSTRAINT "FK_a9b3e529a600fb7619ad3c45b69" FOREIGN KEY ("fkUser") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "connections" DROP CONSTRAINT "FK_a9b3e529a600fb7619ad3c45b69"`);
        await queryRunner.query(`ALTER TABLE "message" DROP CONSTRAINT "FK_0381f14f34f862237dfd4a2c4dd"`);
        await queryRunner.query(`DROP TABLE "connections"`);
        await queryRunner.query(`DROP TABLE "message"`);
    }

}
