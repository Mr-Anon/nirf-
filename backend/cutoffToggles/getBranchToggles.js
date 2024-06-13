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
async function getBranchedCutoffswithCode(codes, branches) {
    var cutoffs = await Cutoffs.find({ _id: { $in: codes } });
    // return cutoffs[0].academic_programs;
    let branchedcutoffswithcodes = await getOpeningClosingRanks(cutoffs, branches);
    
    return branchedcutoffswithcodes;
}

async function getMinMaxcutoff(codes, branches) {

    var branchedcutoffs = [];
    var branchedcutoffswithcodes = await getBranchedCutoffswithCode(codes, branches);
    await branchedcutoffswithcodes.forEach(async cutoffs => {
        cutoffs[1].forEach(async cutoff => {
            branchedcutoffs.push([cutoff[0], cutoff[1]]);
        });
    });
    console.log(branchedcutoffs ); 
    
    let min = 9999999999;
    let max = 0;
    await branchedcutoffs.forEach(async cutoff => {
        if (cutoff[0] < min) {
            min = cutoff[0];
        }
        if (cutoff[1] > max) {
            max = cutoff[1];
        }
    });
    return [min, max];

}
async function getOpeningClosingRanks(filteredCutoffs, Branches, QuotaName = ['AI','OS'], SeatTypeName = ['OPEN'], GenderName = ['Gender-Neutral']) {
    var cutoffArraywithcode = [];
    // console.log(filteredCutoffs[0].institute_name)
    // console.log(filteredCutoffs[0].academic_programs[0].quotas)
    await filteredCutoffs.forEach(async cutoff => {
        await cutoff.academic_programs.forEach(async program => {
            var id = await cutoff._id;
            const cutoffArray = [];
            if (Branches.includes((program.academic_program_name).split(' (')[0])) {
                await program.quotas.forEach(async quota => {
                    if (QuotaName.includes(quota.quota_name)) {
                        await quota.seat_types.forEach(async seatType => {
                            if (SeatTypeName.includes(seatType.seat_type_name)) {
                                await seatType.genders.forEach(async gender => {
                                    if (GenderName.includes(gender.gender_name)) {
                                        await gender.ranks.forEach(async rank => {
                                            cutoffArray.push([rank.opening_rank, rank.closing_rank]);
                                        });
                                    }
                                });
                            }
                        });
                    }
                });
            }
            cutoffArraywithcode.push([id, cutoffArray]);
        });
    });
    return cutoffArraywithcode;
}


module.exports = {
    getBranches: getBranches,
    getMinMaxcutoff: getMinMaxcutoff,
    getOpeningClosingRanks: getOpeningClosingRanks,
    getBranchedCutoffswithCode: getBranchedCutoffswithCode 
};

