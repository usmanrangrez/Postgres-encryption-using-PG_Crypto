// models/pgcrypto-utils.js
const { QueryTypes } = require('sequelize');
const sequelize = require('../config/database');

const encrypt = async (value) => {
    try {
        const result = await sequelize.query(
            `SELECT encode(pgp_sym_encrypt(:value, :key), 'base64') AS encrypted`,
            {
                replacements: { value: value, key: process.env.ENCRYPTION_KEY },
                type: QueryTypes.SELECT
            }
        );
        return result[0].encrypted;
    } catch (error) {
        console.error('Encryption error:', error);
        throw error;
    }
};

const decrypt = async (value) => {
    try {
        const result = await sequelize.query(
            `SELECT pgp_sym_decrypt(decode(:value, 'base64'), :key) AS decrypted`,
            {
                replacements: { value: value, key: process.env.ENCRYPTION_KEY },
                type: QueryTypes.SELECT
            }
        );
        return result[0].decrypted;
    } catch (error) {
        console.error('Decryption error:', error);
        throw error;
    }
};

module.exports = { encrypt, decrypt };