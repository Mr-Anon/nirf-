// async function computeSkyline(colleges, skyline) {
//     let skylineColleges = [];
//     for (let i = 0; i < colleges.length; i++) {
//         let currentCollege = colleges[i];
//         let dominated = true;
//         let betterInAllParams = true;
//         for (let j = 0; j < colleges.length; j++) {
//             if (i !== j) {
//                 let otherCollege = colleges[j];
//                 for (let param in skyline) {
//                     if (skyline[param]) {
//                         console.log(currentCollege[param])
//                         console.log(otherCollege[param])
//                         if (currentCollege[param] < otherCollege[param]) {
//                             console.log("Helloayush")
//                             betterInAllParams = false;
//                             break;
//                         }
//                     }
//                 }
//                 if (betterInAllParams) {
//                     dominated = false;
//                     break;
//                 }
//             }
//         }
//         if (!dominated) {
//             skylineColleges.push(currentCollege);
//         }
//     }
//     return skylineColleges;
// }



async function computeSkyline(colleges, skyline) {
    let skylineColleges = [];
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
            number_of_students_placed: 0
        };

        for (let param in averageData) {
            modifiedCollege[param] += averageData[param];
        }

        await modifiedColleges.push(modifiedCollege)
        // await console.log(modifiedCollege)
        // console.log(college.averageData)
    }
    // Compare colleges
    for (let i = 0; i < modifiedColleges.length; i++) {
        let currentCollege = modifiedColleges[i];
        let currentCollegeOg = colleges[i];
        let dominated = false;
        let flag = false;
        for (let j = 0; j < modifiedColleges.length; j++) {
            if (i !== j && !flag) {
                let otherCollege = modifiedColleges[j];
                let betterInAllParams = true;
                let noparam = true;
                flag = true
                for (let param in skyline) {
                    // console.log(param)
                    if (skyline[param]) {
                        noparam = false
                        if (otherCollege[param] <= currentCollege[param]) {
                            // console.log(currentCollege.name)
                            // console.log(currentCollege.averageData[param])
                            // console.log(otherCollege.name)
                            // console.log(otherCollege.averageData[param])
                            betterInAllParams = false;
                            flag = false
                            break;
                        }
                    }
                }
                if (betterInAllParams && !noparam) {
                    dominated = true;
                    break;
                }
            }
        }
        if (!dominated) {
            skylineColleges.push(currentCollegeOg);
        }
    }
    return skylineColleges;
}


async function getSkyline(response, skyline) {
    var colleges = response.college;
    // console.log(skyline)
    // console.log(colleges.length)

    // Example colleges data
    // const colleges = [
    //     { name: "College A", median_salary: 70000, students_in_graduating_batch: 100, no_of_faculty: 378, },
    //     { name: "College B", median_salary: 60000, students_in_graduating_batch: 120, no_of_faculty: 378, },
    //     { name: "College C", median_salary: 65000, students_in_graduating_batch: 110, no_of_faculty: 734, }
    // ];

    // Compute skyline
    var skylineColleges = await computeSkyline(colleges, skyline);
    console.log('colleges.length')
    console.log(colleges.length)

    // skylineColleges.push(await computeSkyline((colleges.filter(item => item !== skylineColleges),skyline)))
    console.log('skylineColleges.length')
    console.log(skylineColleges.length)
    var flag = true
    while (flag) {
        var len = skylineColleges.length
        if (len >= 5) {
            flag = false
        }
        for (let i = 0; i < len; ++i) {
            colleges = await colleges.filter((_, index) => index !== colleges.indexOf(skylineColleges[i]));
            // console.log('colleges.length')
            // console.log(colleges.length)
        }
        for (let skylineCollege of await computeSkyline(colleges, skyline)) {
            skylineColleges.push(skylineCollege);
            console.log('skylineColleges.length')
            console.log(skylineColleges.length)
        }
    }
    // console.log("Skyline Colleges:");
    // console.log(skylineColleges);

    // if (skyline.PCS == true) {
    //     console.log("PCS toggle True")
    //     colleges = ToggleFilterCollegesByFacilities(colleges);
    // }
    // if (skyline.UG == true) {
    //     console.log("UG toggle True")
    //     colleges = ToggleFilterCollegesByUG(colleges);
    // }
    // if (skyline.PG == true) {
    //     console.log("PG toggle True")
    //     colleges = ToggleFilterCollegesByPG(colleges);
    // }
    // console.log(colleges.length)
    return skylineColleges;
}

module.exports = getSkyline;