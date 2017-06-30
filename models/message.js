'use strict';
module.exports = function(sequelize, DataTypes) {
  var message = sequelize.define('message', {
    content: { type: DataTypes.STRING, allowNull: false }
  });

  message.associate = function(models) {
    message.belongsTo(models.user, { foreignKey: 'userId' });
    // message.hasMany(models.like, { foreignKey: 'messageId' });
  }

  return message;
};