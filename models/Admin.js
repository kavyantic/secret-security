const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const passportLocalMongoose = require('passport-local-mongoose');
const validator = require('mongoose-validator')
const uniqueValidator  = require('mongoose-unique-validator');
const InfoSchema = require('./Info')

adminSchema = new mongoose.Schema({
    active:Boolean,
    ...InfoSchema

  })

adminSchema.plugin(uniqueValidator, {message: 'is already taken'});

mongoose.model('Admin',adminSchema)

