var mongoose = require('mongoose');
var Schema =mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');
var userShema = new Schema({
    email: {type: String, required: true},
    password: {type: String, required: true}
});
userShema.methods.encryptPassword = function(password){
    return bcrypt.hashSync(password, bcrypt.genSaltSync(5),null);
};
userShema.methods.validPassword= function(password){

    return bcrypt.compareSync(password,this.password);
};
module.exports = mongoose.model('User', userShema);