async function getFiltered(response, filters) {
    var colleges = response.college;

    // Function to calculate the average of an array of numbers
    const calculateAverage = async (arr) => {
        const sum = arr.reduce((acc, val) => acc + val, 0);
        return sum / arr.length;
    };

    // Iterate through colleges
    // const filteredColleges = 
    const filteredColleges = []
    for(const college of colleges){
        // Calculate averages for each numerical attribute in ssDataArray
        const averages = {};
        await college.ssDataArray.forEach(data => {
            Object.keys(filters).forEach(key => {
                if (typeof data[key] === 'number') {
                    averages[key] = averages[key] || [];
                    averages[key].push(data[key]);
                }
            });
        });

        // Check if the averages meet the filter criteria
        const ssDataArrayCriteriaMet = []
        console.log(averages)
        for(const attr of Object.keys(filters)){
            if (college.ssDataArray.length === 0) ssDataArrayCriteriaMet.push(false);
            if (averages[attr]) {
                const [min, max] = filters[attr];
                const avg = await calculateAverage(averages[attr]);
                if (!(avg >= min && avg <= max)) {
                    console.log(`Average ${avg} for ${attr} not within range [${min}, ${max}]`);
                }
                ssDataArrayCriteriaMet.push(avg >= min && avg <= max);
            } else if (typeof college[attr] === 'number' && typeof filters[attr] !== 'undefined') {
                if (!(college[attr] >= filters[attr][0] && college[attr] <= filters[attr][1])) {
                    console.log(`Value ${college[attr]} for ${attr} not within range [${filters[attr][0]}, ${filters[attr][1]}]`);
                    ssDataArrayCriteriaMet.push(false);
                }
                ssDataArrayCriteriaMet.push(college[attr] >= filters[attr][0] && college[attr] <= filters[attr][1]);
            }
        }
    
   
        await console.log(ssDataArrayCriteriaMet)
        if (ssDataArrayCriteriaMet.includes(false)){
            continue
        }
        else{
            filteredColleges.push(college)
        }
    }

    await console.log("asdasdasdasd");
    await console.log(filteredColleges.length);
    return filteredColleges;
}

module.exports = getFiltered;
