const getRankedToggled = require('../toggles/defaultToggleFunc');
const rankColleges = require('./defaultRankingFunc');
const getSkyline = require('../Skyline/defaultSkylinefunction')
const getFiltered =  require('../filters/defaultFilterFunc')
async function rankToggledColleges(colResponse, weights, response)  {
    var colleges = colResponse.college;
    console.log("hello")
    colleges = await getSkyline({ college: await getRankedToggled({ college: await getFiltered({college : colleges}, response.filters) },response.toggles) },response.skyline)
    return rankColleges({college: colleges}, weights);
}

module.exports = rankToggledColleges;