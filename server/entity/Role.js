/**
 * Created by alone on 17-6-21.
 */
'use strict';
module.exports = function(sequelize, DataTypes) {
    return sequelize.define('Role', {
        pid: DataTypes.BIGINT,
        name: DataTypes.STRING,
        pids: DataTypes.STRING,
        status: DataTypes.BOOLEAN,
        only_login: DataTypes.BOOLEAN
    }, {
        underscored: true,
        tableName: 't_role'
    });
};