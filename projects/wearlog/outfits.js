var promises = [
    d3.json("./data/wearlog.json"), 
    d3.csv("./data/wearlog.csv", parse)
];

Promise.all(promises).then(function(data) {
    jsonData = data[0];
    csvData = data[1];

    let items = [];
    for(let i = 0; i < csvData.length; i++) {
        let ids = [csvData[i].id];
        ids.forEach(function(val) {
            if(items.indexOf(val) < 0) {
                items.push(val);
            }
        }
        )
    }
    console.log(items)
    
    let outfits = [];
    for(let i = 0; i < jsonData.weeks.length; i++) {
        let week = jsonData.weeks[i];
        for(let j = 0; j < week.days.length; j++) {
            let outfit = week.days[j]
            outfits.push(outfit);
        }
    }

    outfits.forEach(function(d,i) {
        let arr = [];
        let outfit = outfits[i].outfit;
        outfit.forEach(function(v,j){
            arr.push(outfit[j].garmentId)
        })
        d.idSet = arr;
    })
    console.log(outfits)

    var nested = d3.nest()
        .key(function(d) { return d.idSet; })
        .rollup()
        // .rollup()
        .entries(outfits)
    nested.sort(function(a,b) {return d3.descending(a.values.length, b.values.length)})
    console.log(nested)

    function removeDuplicates(originalData, prop) {
        var newData = [];
        var lookupObject = {};

        for(var i in originalData) {
            lookupObject[originalData[i][prop]] = originalData[i];
         }
    
         for(i in lookupObject) {
             newData.push(lookupObject[i]);
         }
          return newData;

    }

    // var uniqueArray = removeDuplicates(outfits, "show"); 
});

function parse(d) {

    return {
        date: new Date(d.date),
        description: (d.Brand + " ").concat((d.Description + " ")).concat(d.Sub_Category),
        id: +d.garmentId,
        group: d.group
    }
    
}