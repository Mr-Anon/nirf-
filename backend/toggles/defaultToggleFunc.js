const getBranches = require('../cutoffToggles/getBranchToggles');
const api = require('../routes/api');


async function ToggleFilterCollegesByFacilities(colleges) {
    return colleges.filter(college => {
        return college.pcs_lift_ramps &&
            college.pcs_wheelchair &&
            college.pcs_designed_toilets;
    });
}

async function ToggleFilterCollegesByUG(colleges) {
    return colleges.filter(college => {
        return college.ssDataArray.some(data => {
            return data.name_of_class.toLowerCase().includes("ug");
        });
    });
}
async function ToggleFilterCollegesByPG(colleges) {
    return colleges.filter(college => {
        return college.ssDataArray.some(data => {
            return data.name_of_class.toLowerCase().includes("pg");
        });
    });
}

async function getBranchedColleges(response, branches) {
    const branchToggles = await getBranches(response);
    let codes = [];
    branchToggles.forEach(entry => {
        branches.forEach(branch => {
            if (entry[1].includes(branch)) {
                codes.push(entry[0]);
            }
        });
    });
    let colleges = response.college;
    const branchedColleges = await colleges.filter(college => {
        return codes.includes(college.code);
    });
    console.log(await api.getMinMaxcutoff(codes, branches));
    return branchedColleges, codes;
}

async function getRankedToggled(response, toggles) {
    var colleges = response.college;
    // console.log(toggles)
    // console.log(colleges.length)

    if (toggles.PCS == true) {
        console.log("PCS toggle True")
        colleges = await ToggleFilterCollegesByFacilities(colleges);
    }
    if (toggles.UG == true) {
        console.log("UG toggle True")
        colleges = await ToggleFilterCollegesByUG(colleges);
    }
    if (toggles.PG == true) {
        console.log("PG toggle True")
        colleges = await ToggleFilterCollegesByPG(colleges);
    }
    const trueKeys = Object.keys(toggles).filter(key => toggles[key] === true);
    return await getBranchedColleges({college: colleges}, trueKeys.filter(key => key !== 'PCS' && key !== 'UG' && key !== 'PG'));;
}

module.exports = getRankedToggled;
