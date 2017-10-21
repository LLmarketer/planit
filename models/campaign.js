// models/campaign.js
const mongoose = require('mongoose');
const Schema   = mongoose.Schema;
const TYPES    = require('./campaign-types');
//const CATS     = require('./campaign-pro-types');
const moment = require ('moment');

const CampaignSchema = new Schema({
  title         : { type: String, required: true },
  description   : { type: String, required: true },
  category      : { type: String, enum: TYPES, required: true },
  _creator      : { type: Schema.Types.ObjectId, ref: 'User', required: true },
  goal          : { type: Number, required: true },
  startdate      : { type: Date, required: true },
  enddate      : { type: Date, required: true },
  products      :{ type: String, required: false },
  //products      :  [{type: Schema.Types.ObjectId, ref: 'Product', required: false }],
  percentage    : { type: String, required:false}
});

CampaignSchema.virtual('timeRemaining').get(function () {
  let remaining = moment(this.deadline).fromNow(true).split(' ');
  let [days, unit] = remaining;
  return { days, unit };
});

CampaignSchema.virtual('inputFormattedDate').get(function(){
  return moment(this.deadline).format('YYYY-MM-DD');
});

module.exports = mongoose.model('Campaign', CampaignSchema);
