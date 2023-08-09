const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const {Schema} = mongoose;

const AdminSchema = new Schema({
    email: {
        type: String,
        required: true
    },

    password: {
        type: String,
        required: true
    },

    name: {
        type: String,
        required: true
    },

    imageUrl : {
        type: String,
        default: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png'
    },
    status: {
        type: Boolean,
        default: true
    }
})

AdminSchema.pre('save', function (next) {
    let user = this;
    const saltRounds = 10;

    if (!user.isModified('password')) {
        return (next)
    }

    bcrypt.genSalt(saltRounds, (err, salt) => {

        if(err){
            return next(err)
        }

        bcrypt.hash(user.password, salt, (err, hash) => {
            if(err){
                return next(err)
            }

            user.password = hash
            next()
        })
    })
})

AdminSchema.methods.comparePassword = async function(candidatePassword) {
    try {
      const isMatch = await bcrypt.compare(candidatePassword, this.password);
      return isMatch;
    } catch (error) {
      throw error;
    }
  };

module.exports = mongoose.model('Admin', AdminSchema)