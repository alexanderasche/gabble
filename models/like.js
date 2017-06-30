'use strict';
module.exports = function(sequelize, DataTypes) {
  var like = sequelize.define('like', {
    active: { type: DataTypes.STRING, allowNull: false, defaultValue: false }
  });
  like.associate = function(models) {
    like.belongsTo(models.user, { foreignKey: 'id' });
    like.belongsTo(models.message, { foreignKey: 'id' });
  }
  return like;
};