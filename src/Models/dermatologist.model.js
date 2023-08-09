const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const { Schema } = mongoose;

const DermatologistSchema = new Schema({
    email: {
        type: String,
        required: true
    },

    password: {
        type: String,
        default: '1234567891'
    },

    name: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true
    },

    phoneNumber: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        default: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png'
    },
    status: {
        type: Boolean,
        default: true
    }
})

DermatologistSchema.pre('save', function (next) {
    let user = this;
    const saltRounds = 10;

    // skip this because 
    // If the password has not been modified, skip hashing and move to the next middleware
    // if (!user.isModified('password')) {
    //     return (next)
    // }
    /*When you provide a default value for a field, including the password field, 
    Mongoose sets that default value when a new document is created unless a different value is explicitly provided. This default value is set before any pre-save hooks are executed. 
    As a result, if you provide a default value for the password field, the hashing process in the pre-save hook will not be triggered if the password is not explicitly modified.*/

    /*When you create a new Dermatologist document without providing a value for the password field,
     Mongoose will use the default value '1234567891'. 
     Since the default value is being set, 
     Mongoose considers the field as not modified (even though a value is assigned), 
     and this causes the hashing process to be skipped in the pre-save hook.*/

    bcrypt.genSalt(saltRounds, (err, salt) => {

        if (err) {
            return next(err)
        }

        bcrypt.hash(user.password, salt, (err, hash) => {
            if (err) {
                return next(err)
            }

            user.password = hash
            next()
        })
    })
})

DermatologistSchema.methods.comparePassword = async function (candidatePassword) {
    try {
        const isMatch = await bcrypt.compare(candidatePassword, this.password);
        return isMatch;
    } catch (error) {
        throw error;
    }
};

module.exports = mongoose.model('Dermatologist', DermatologistSchema)