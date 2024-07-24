function splitOnLastSpace(str) {
    const lastSpaceIndex = str.lastIndexOf(' ');
    if (lastSpaceIndex !== -1) {
        const firstPart = str.substring(0, lastSpaceIndex);
        const secondPart = str.substring(lastSpaceIndex + 1);
        return [firstPart, secondPart];
    } else {
        // If there's no space in the string
        return [str];
    }
}

function rankColleges(response, weights) {
    var colleges = response.college;

    // Create a ranked list by calculating a weighted score for each college
    const rankedList = colleges.map(college => {
        // Initialize weighted score for the college
        let weightedScore = 0;

        // Weight parameters and their ratings
        const parameters = {
            placementPercentage: {
                weight: weights.placementPercentage, getValue: college => {
                    return college.ssDataArray.reduce((acc, curr) => acc + (curr.number_of_students_placed / curr.number_of_students_graduating) * 100, 0) / college.ssDataArray.length;
                }
            },
            medianSalary: {
                weight: weights.medianSalary, getValue: college => {
                    return college.ssDataArray.reduce((acc, curr) => acc + curr.median_salary / 100000, 0) / college.ssDataArray.length;
                }
            },
            noOfSelectedForHigherStudies: {
                weight: weights.noOfSelectedForHigherStudies, getValue: college => {
                    return college.ssDataArray.reduce((acc, curr) => acc + 100*(curr.no_of_selected_for_higher_studies / curr.total_students), 0) / college.ssDataArray.length;
                }
            },
            fullTimePhD: { weight: weights.fullTimePhD, getValue: college => college.fulltime_phd / 100 },
            partTimePhD: { weight: weights.partTimePhD, getValue: college => college.parttime_phd / 100 },
            amountReceivedResearch: { weight: weights.amountReceivedResearch, getValue: college => college.amount_received_research / 10000000 },
            noOfFaculty: { weight: weights.noOfFaculty, getValue: college => college.no_of_faculty / 100 },
            pcsLiftRamps: { weight: weights.pcsLiftRamps, getValue: college => college.pcs_lift_ramps ? 5 : 0 },
            pcsWheelchair: { weight: weights.pcsWheelchair, getValue: college => college.pcs_wheelchair ? 5 : 0 },
            pcsDesignedToilets: { weight: weights.pcsDesignedToilets, getValue: college => college.pcs_designed_toilets ? 5 : 0 },
            // Add more parameters
            // total_students: {weight: 1, getValue: college.ssDataArray.reduce((acc,curr) => curr.total_students)},
            economicallyBackwardStudents: {
                weight: weights.economicallyBackwardStudents, getValue: college => {
                    // return college.ssDataArray.reduce((acc, curr) => acc + curr.total_students, 0) / college.ssDataArray.length;
                    return college.ssDataArray.reduce((acc, curr) => acc + 100*(curr.economically_backward_students / curr.total_students), 0) / college.ssDataArray.length;
                }
            },
            sociallyChallengedStudents: {
                weight: weights.sociallyChallengedStudents, getValue: college => {
                    return college.ssDataArray.reduce((acc, curr) => acc + 100*(curr.socially_challenged_students / curr.total_students), 0) / college.ssDataArray.length;
                }
            },
            withinStateStudents: {
                weight: weights.withinStateStudents, getValue: college => {
                    return college.ssDataArray.reduce((acc, curr) => acc + 100*(curr.within_state_students / curr.total_students), 0) / college.ssDataArray.length;
                }
            },
            outsideStateStudents: {
                weight: weights.outsideStateStudents, getValue: college => {
                    return college.ssDataArray.reduce((acc, curr) => acc + 100*(curr.outside_state_students / curr.total_students), 0) / college.ssDataArray.length;
                }
            }
            // Add more parameters here 
        };

        // Calculate weighted score for each parameter
        for (const paramName in parameters) {
            if (parameters.hasOwnProperty(paramName)) {
                const paramWeight = parameters[paramName].weight;
                const paramValue = parameters[paramName].getValue(college);
                console.log(paramName + ": " + paramValue)
                if (!isNaN(paramValue))
                    weightedScore += paramWeight * paramValue;
            }
        }
        const [firstPart, secondPart] = splitOnLastSpace(college.name);
        return { name: college.name, city: secondPart, weightedScore: weightedScore };
    }).sort((a, b) => b.weightedScore - a.weightedScore);

    // console.log(rankedList)
    return {college: rankedList,
            cutoff: response.cutoff};
}


module.exports = rankColleges;
