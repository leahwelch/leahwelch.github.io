
d3.csv("./data/themoviedb_2019_small.csv", function(data) {

    data.forEach(function(d){
        d.year = +d.year; 
    });

    data.forEach(function(d){
        d.episodes = +d.episodes; 
    });

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

    var uniqueArray = removeDuplicates(data, "show");

    var nodes = [];
        for(var i = 0; i < uniqueArray.length; i++) {
            nodes.push({id: i, actor: uniqueArray[i].actor, show: uniqueArray[i].show, value: uniqueArray[i].episodes});
        };
    console.log(nodes);
    
    

    




});
