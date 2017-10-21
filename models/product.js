const mongoose = require('mongoose');
const Schema   = mongoose.Schema;
const PROTYPES     = require('../models/campaign-pro-types');
const moment = require ('moment');

const ProductSchema = new Schema ({
name : {type: String, required: true},
picture : {type: String, required: true},
sku : {type: String, required: true},
cat: { type: String, enum: PROTYPES, required: true },
price: { type: Number, required: true },
})


module.exports = mongoose.model('Product', ProductSchema);
