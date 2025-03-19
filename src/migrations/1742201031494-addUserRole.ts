import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUserRole1742201031494 implements MigrationInterface {
    name = 'AddUserRole1742201031494'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "role" character varying NOT NULL DEFAULT 'common'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "role"`);
    }

}
