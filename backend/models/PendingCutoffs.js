const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cutoffsSchema = new Schema({
  institute_name: String,
  Academic_Program_Name: String,
  Quota: String,
  Seat_Type: String,
  Gender: String,
  Opening_Rank: Number,
  Closing_Rank: Number,
  User_Id: String
});

const PendingCutoffs = mongoose.model('PendingCutoffs', cutoffsSchema);

module.exports = PendingCutoffs;