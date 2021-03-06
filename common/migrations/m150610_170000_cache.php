<?php

use yii\db\Schema;

class m150610_170000_cache extends \cookyii\db\Migration
{

    public function up()
    {
        $this->createTable('{{%cache}}', [
            'id' => Schema::TYPE_STRING . '(128) NOT NULL',
            'expire' => Schema::TYPE_INTEGER,
            'data' => 'LONGBLOB',
            'PRIMARY KEY (id)',
        ]);

        $this->createIndex('idx_expire', '{{%cache}}', ['expire']);
    }

    public function down()
    {
        $this->dropTable('{{%cache}}');
    }
}