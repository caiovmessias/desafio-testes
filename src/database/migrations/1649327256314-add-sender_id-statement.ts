import {MigrationInterface, QueryRunner, TableColumn, TableForeignKey} from "typeorm";

export class addSenderIdStatement1649327256314 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.addColumn(
        'statements',
        new TableColumn({
          name: 'sender_id',
          type: 'uuid',
          isNullable: true,
        })
      );

      await queryRunner.createForeignKey(
        'statements',
        new TableForeignKey({
          name: 'FKSenderIdUser',
          referencedTableName: 'users',
          referencedColumnNames: ['id'],
          columnNames: ['sender_id'],
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE'
        })
      );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.dropColumn('statements', 'sender_id');
      await queryRunner.dropForeignKey('statements', 'FKSenderIdUser');
    }

}
