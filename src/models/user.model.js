const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const { encrypt, decrypt } = require('./pgcrypto-utils');

class UserInfo extends Model {}

// Define fields that need encryption
const ENCRYPTED_FIELDS = ['firstName', 'lastName', 'address', 'mobile'];

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
      await Promise.all(
        ENCRYPTED_FIELDS.map(async field => {
          if (user[field]) {
            user[field] = await encrypt(user[field]);
          }
        })
      );
    },
    beforeUpdate: async (user) => {
      const changed = user.changed();
      if (changed) {
        await Promise.all(
          ENCRYPTED_FIELDS.filter(field => changed.includes(field))
            .map(async field => {
              user[field] = await encrypt(user[field]);
            })
        );
      }
    },
    afterFind: async (result) => {
      if (!result) return;

      const decryptFields = async (user) => {
        await Promise.all(
          ENCRYPTED_FIELDS.map(async field => {
            if (user[field]) {
              user[field] = await decrypt(user[field]);
            }
          })
        );
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