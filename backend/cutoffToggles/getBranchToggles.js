const Cutoffs = require('../models/Cutoffs');

async function getBranchesFromCode(code) {
    var cutoff = await Cutoffs.find({ _id: code });
    const academicProgramNames = [];

    await cutoff[0].academic_programs.forEach(async program => {
        if (program.academic_program_name) {
            academicProgramNames.push(program.academic_program_name.split(' (')[0]);
        }
    });

    return [code, academicProgramNames];
}

async function getBranches(response) {
    var colleges = response.college;
    var collegeWithCode = await colleges.filter(college => {
        return (college.code !== null && college.code !== undefined)
    });
    let branchesWithCode = [];
    if (collegeWithCode) {
        var collegeBranches = await Promise.all(collegeWithCode.map(async college => {
            branchesWithCode.push(await getBranchesFromCode(college.code));
            return college.code;
        }));
    } else {
        console.log("collegeWithCode is null");
    }
    console.log("Branches with code done");
    return await branchesWithCode;
}


module.exports = getBranches;

