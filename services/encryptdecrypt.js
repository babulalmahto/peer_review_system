const bcrypt = require('bcrypt');

class EncryptDecrypt {

    encryptPass(pass) {
        return new Promise((resolve, reject) => {
            const saltRounds = 10;
            bcrypt.genSalt(saltRounds, function (err, salt) {
                bcrypt.hash(pass, salt, function (err, hash) {
                    resolve(hash);
                });
            });
        });
    }

    async decryptPass(password, hash) {
        try {
            const result = await bcrypt.compare(password, hash);
            return result;
        }
        catch (error) {
            console.log(error);
        }
    }

}
module.exports = new EncryptDecrypt;