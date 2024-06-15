const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ssDataSchema = new mongoose.Schema({
   name_of_class: {
      type: String,
      required: true
   },
   no_of_male_students: {
      type: Number,
      required: false
   },
   no_of_female_students: {
      type: Number,
      required: false
   },
   total_students: {
      type: Number,
      required: false
   },
   within_state_students: {
      type: Number,
      required: false
   },
   outside_state_students: {
      type: Number,
      required: false
   },
   outside_country_students: {
      type: Number,
      required: false
   },
   economically_backward_students: {
      type: Number,
      required: false
   },
   socially_challenged_students: {
      type: Number,
      required: false
   },
   full_tuitionfee_reimburse_gov: {
      type: Number,
      required: false
   },
   full_tuitionfee_reimburse_institution: {
      type: Number,
      required: false
   },
   full_tuitionfee_reimburse_private: {
      type: Number,
      required: false
   },
   full_tuitionfee_not_reimburse: {
      type: Number,
      required: false
   },
   students_in_graduating_batch: {
      type: Number,
      required: false
   },
   joining_academic_year: {
      type: String,
      required: true
   },
   graduating_academic_year: {
      type: String,
      required: true
   },
   median_salary: {
      type: Number,
      required: false
   },
   no_of_selected_for_higher_studies: {
      type: Number,
      required: false
   },
   number_of_students_graduating: {
      type: Number,
      required: false
   },
   number_of_students_placed: {
      type: Number,
      required: false
   }
});

let collegeSchema = new Schema({
   name: {
      type: String,
      required: true
   },
   code: {
      type: String,
      required: false
   },
   ssDataArray: [ssDataSchema],
   fulltime_phd: {
      type: Number,
      required: false
   },
   parttime_phd: {
      type: Number,
      required: false
   },
   amount_received_research: {
      type: Number,
      required: false
   },
   pcs_lift_ramps: {
      type: Boolean,
      required: false
   },
   pcs_wheelchair: {
      type: Boolean,
      required: false
   },
   pcs_designed_toilets: {
      type: Boolean,
      required: false
   },
   no_of_faculty: {
      type: Number,
      required: true
   },
   data_link: {
      type: String,
      required: false
   }

}, {
   timestamps: true,
   collection: 'colleges'
})

module.exports = mongoose.model('Colleges', collegeSchema);