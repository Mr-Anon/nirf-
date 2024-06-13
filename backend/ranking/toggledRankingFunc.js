const getRankedToggled = require('../toggles/defaultToggleFunc');
const rankColleges = require('./defaultRankingFunc');
const getSkyline = require('../Skyline/defaultSkylinefunction')
const getFiltered =  require('../filters/defaultFilterFunc')
const cutoffFunc = require('../cutoffToggles/getBranchToggles');

async function getBranchedColleges(response, branches) {
    const branchToggles = await cutoffFunc.getBranches(response);
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

    // console.log(branchedColleges);
    return [branchedColleges, await cutoffFunc.getBranchedCutoffswithCode(codes, branches)];
}

async function rankToggledColleges(colResponse, weights, response)  {
    var colleges = colResponse.college;
    var toggles = response.toggles; 
    const trueKeys = Object.keys(toggles).filter(key => toggles[key] === true);
    let [min, max] = [0, 0];
    var branches = trueKeys.filter(key => key !== 'PCS' && key !== 'UG' && key !== 'PG');
    console.log(branches);
    if (branches.length !== 0) {
        var output = await getBranchedColleges({ college: colleges }, branches);
        // console.log('branchedcutoffs'); 
        colleges = output[0];
        // console.log(output[1]);
        var branchedcutoffs = [];
        var branchedcutoffswithcodes = output[1];
        await branchedcutoffswithcodes.forEach(async cutoffs => {
            cutoffs[1].forEach(async cutoff => {
                branchedcutoffs.push([cutoff[0], cutoff[1]]);
            });
        });
        // console.log(branchedcutoffs); 
        
        let min = 9999999999;
        let max = -1;
        await branchedcutoffs.forEach(async (cutoff) => {
            if (cutoff[0] < min) {
                min = cutoff[0];
            }
            if (cutoff[1] > max) {
                max = cutoff[1];
            }
        });
        // console.log(min,max);
        let minmax = [min,max];
        var filteredColleges = await getSkyline(await getRankedToggled({ college: await getFiltered({college : colleges, cutoffWithCodes: branchedcutoffswithcodes}, response.filters, ), cutoff: minmax },response.toggles) ,response.skyline)
    
    }
    else{
    var filteredColleges = await getSkyline(await getRankedToggled({ college: await getFiltered({college : colleges, cutoffWithCodes: {}}, response.filters, ), cutoff: [min,max] },response.toggles) ,response.skyline)
    }
    console.log("Cutoffs:")
    console.log(filteredColleges.cutoff)
    return rankColleges(filteredColleges, weights);
}

module.exports = rankToggledColleges;