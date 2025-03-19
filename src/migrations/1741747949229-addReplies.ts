import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddReplies1741747949229 implements MigrationInterface {
  name = 'AddReplies1741747949229';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "comment" ADD "parentId" uuid`);
    await queryRunner.query(
      `ALTER TABLE "comment" ADD CONSTRAINT "FK_e3aebe2bd1c53467a07109be596" FOREIGN KEY ("parentId") REFERENCES "comment"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "comment" DROP CONSTRAINT "FK_e3aebe2bd1c53467a07109be596"`,
    );
    await queryRunner.query(`ALTER TABLE "comment" DROP COLUMN "parentId"`);
  }
}
