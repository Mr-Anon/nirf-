
function ToggleFilterCollegesByFacilities(colleges) {
    return colleges.filter(college => {
        return college.pcs_lift_ramps &&
            college.pcs_wheelchair &&
            college.pcs_designed_toilets;
    });
}

function ToggleFilterCollegesByUG(colleges) {
    return colleges.filter(college => {
        return college.ssDataArray.some(data => {
            return data.name_of_class.toLowerCase().includes("ug");
        });
    });
}

function ToggleFilterCollegesByPG(colleges) {
    return colleges.filter(college => {
        return college.ssDataArray.some(data => {
            return data.name_of_class.toLowerCase().includes("pg");
        });
    });
}

function getRankedToggled(response, toggles) {
    var colleges = response.college;
    console.log(toggles)
    console.log(colleges.length)

    if (toggles.PCS == true) {
        console.log("PCS toggle True")
        colleges = ToggleFilterCollegesByFacilities(colleges);
    }
    if (toggles.UG == true) {
        console.log("UG toggle True")
        colleges = ToggleFilterCollegesByUG(colleges);
    }
    if (toggles.PG == true) {
        console.log("PG toggle True")
        colleges = ToggleFilterCollegesByPG(colleges);
    }
    console.log(colleges.length)
    return colleges;
}

module.exports = getRankedToggled;
