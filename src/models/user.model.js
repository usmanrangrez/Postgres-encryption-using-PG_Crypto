// models/user.model.js
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const { encrypt, decrypt } = require('./pgcrypto-utils');

class UserInfo extends Model {}

UserInfo.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'first_name'
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'last_name'
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false
  },
  mobile: {
    type: DataTypes.STRING,
    allowNull: false
  },
  createdAt: {
    type: DataTypes.DATE,
    field: 'created_at'
  },
  updatedAt: {
    type: DataTypes.DATE,
    field: 'updated_at'
  }
}, {
  sequelize,
  modelName: 'UserInfo',
  tableName: 'user_info',
  timestamps: true,
  hooks: {
    beforeCreate: async (user) => {
      if (user.firstName) user.firstName = await encrypt(user.firstName);
      if (user.lastName) user.lastName = await encrypt(user.lastName);
      if (user.address) user.address = await encrypt(user.address);
      if (user.mobile) user.mobile = await encrypt(user.mobile);
    },
    beforeUpdate: async (user) => {
      const changed = user.changed();
      if (changed && changed.includes('firstName')) user.firstName = await encrypt(user.firstName);
      if (changed && changed.includes('lastName')) user.lastName = await encrypt(user.lastName);
      if (changed && changed.includes('address')) user.address = await encrypt(user.address);
      if (changed && changed.includes('mobile')) user.mobile = await encrypt(user.mobile);
    },
    afterFind: async (result) => {
      if (!result) return;

      const decryptFields = async (user) => {
        if (user.firstName) user.firstName = await decrypt(user.firstName);
        if (user.lastName) user.lastName = await decrypt(user.lastName);
        if (user.address) user.address = await decrypt(user.address);
        if (user.mobile) user.mobile = await decrypt(user.mobile);
      };

      if (Array.isArray(result)) {
        await Promise.all(result.map(decryptFields));
      } else {
        await decryptFields(result);
      }
    }
  }
});

module.exports = UserInfo;