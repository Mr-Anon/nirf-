const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ranksSchema = new Schema({
  opening_rank: {
    type: Number,
    required: false
  },
  closing_rank: {
    type: Number,
    required: false
  }
}, { _id: false });

const genderSchema = new Schema({
  gender_name: {
    type: String,
    required: true
  },
  ranks: [ranksSchema]
});

const seatTypeSchema = new Schema({
  seat_type_name: {
    type: String,
    required: true
  },
  genders: [genderSchema]
});

const quotaSchema = new Schema({
  quota_name: {
    type: String,
    required: true
  },
  seat_types: [seatTypeSchema]
});

const academicProgramSchema = new Schema({
  academic_program_name: {
    type: String,
    required: true
  },
  quotas: [quotaSchema]
});

const cutoffsSchema = new Schema({
  institute_name: {
    type: String,
    required: true
  },
  academic_programs: [academicProgramSchema]
}, { timestamps: true, collection: 'cutoffs' });

const Cutoffs = mongoose.model('Cutoffs', cutoffsSchema);

module.exports = Cutoffs;