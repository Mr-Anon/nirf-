async function generateFilters(colleges) {
    // console.log(colleges)
    let modifiedColleges = []
    // Calculate average data for each college
    for (let college of colleges) {
        let totalEntries = college.ssDataArray.length;
        let averageData = {
            no_of_male_students: 0,
            no_of_female_students: 0,
            within_state_students: 0,
            outside_state_students: 0,
            outside_country_students: 0,
            economically_backward_students: 0,
            socially_challenged_students: 0,
            full_tuitionfee_reimburse_gov: 0,
            full_tuitionfee_reimburse_institution: 0,
            full_tuitionfee_reimburse_private: 0,
            full_tuitionfee_not_reimburse: 0,
            students_in_graduating_batch: 0,
            median_salary: 0,
            no_of_selected_for_higher_studies: 0,
            number_of_students_graduating: 0,
            number_of_students_placed: 0
        };

        for (let entry of college.ssDataArray) {
            for (let param in averageData) {
                averageData[param] += entry[param];
            }
        }

        for (let param in averageData) {
            averageData[param] /= totalEntries;
        }
        let modifiedCollege = {
            ...college._doc,
            no_of_male_students: 0,
            no_of_female_students: 0,
            within_state_students: 0,
            outside_state_students: 0,
            outside_country_students: 0,
            economically_backward_students: 0,
            socially_challenged_students: 0,
            full_tuitionfee_reimburse_gov: 0,
            full_tuitionfee_reimburse_institution: 0,
            full_tuitionfee_reimburse_private: 0,
            full_tuitionfee_not_reimburse: 0,
            students_in_graduating_batch: 0,
            median_salary: 0,
            no_of_selected_for_higher_studies: 0,
            number_of_students_graduating: 0,
            number_of_students_placed: 0,
            cutoff_rank: 0,
          };

        for (let param in averageData) {
            modifiedCollege[param] += averageData[param];
        }
        delete modifiedCollege.ssDataArray;
        delete modifiedCollege.createdAt;
        delete modifiedCollege.updatedAt;
        delete modifiedCollege.name;
        delete modifiedCollege.pcs_designed_toilets;
        delete modifiedCollege.pcs_wheelchair;
        delete modifiedCollege.pcs_lift_ramps;
        delete modifiedCollege.__v;
        delete modifiedCollege._id;
        delete modifiedCollege.code;
        await modifiedColleges.push(modifiedCollege)
        // await console.log(modifiedCollege)
    }
    // Initialize an empty object to store filter information
    const filters = {};

    
    // await console.log(modifiedColleges)

    // Iterate through each college
    await modifiedColleges.forEach( obj => {
        Object.keys(obj).forEach(key => {
          if (!filters[key]) {
            filters[key] = [Number.parseInt(Math.floor(obj[key])), Number.parseInt(Math.floor(obj[key]))];
          } else {
            filters[key][0] = Math.min(filters[key][0], Number.parseInt(Math.floor(obj[key])));
            filters[key][1] = Math.max(filters[key][1], Number.parseInt(Math.floor(obj[key])));
          }
        });
      });

    // Return the filters object
    // console.log(filters)
    return filters;
}

// Export the function
module.exports = generateFilters;
