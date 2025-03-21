import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddColumnSocialLoginGoogle1742530254643
  implements MigrationInterface
{
  name = 'AddColumnSocialLoginGoogle1742530254643';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "comment" DROP CONSTRAINT "FK_e3aebe2bd1c53467a07109be596"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD "socialId" character varying`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."user_registertype_enum" AS ENUM('common', 'google', 'kakao', 'naver')`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD "registerType" "public"."user_registertype_enum" NOT NULL DEFAULT 'common'`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "password" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "comment" ADD CONSTRAINT "FK_e3aebe2bd1c53467a07109be596" FOREIGN KEY ("parentId") REFERENCES "comment"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "comment" DROP CONSTRAINT "FK_e3aebe2bd1c53467a07109be596"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "password" SET NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "registerType"`);
    await queryRunner.query(`DROP TYPE "public"."user_registertype_enum"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "socialId"`);
    await queryRunner.query(
      `ALTER TABLE "comment" ADD CONSTRAINT "FK_e3aebe2bd1c53467a07109be596" FOREIGN KEY ("parentId") REFERENCES "comment"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
