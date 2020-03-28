
d3.csv("./data/themoviedb_2019_small.csv", function(data) {

//////////////////////////////////
//Converting date and quantity of episodes variables into numbers 
//////////////////////////////////
    
    data.forEach(function(d){
        d.year = +d.year; 
    });

    data.forEach(function(d){
        d.episodes = +d.episodes; 
    });

//////////////////////////////////
//List of stars
//////////////////////////////////
    
    var stars = [];
        for(var i = 0; i < data.length; i++) {
            var actors = [data[i].actor];
            actors.forEach(function(val) {
                if(stars.indexOf(val) < 0) {
                    stars.push(val);
                }
            }
            )
        }
    console.log(stars);

//////////////////////////////////
    //List of shows
//////////////////////////////////
    
    var shows = [];
        for(var i = 0; i < data.length; i++) {
            var show = [data[i].show];
            show.forEach(function(val) {
                if(shows.indexOf(val) < 0) {
                    shows.push(val);
                }
            }
            )
        }
    //console.log(shows);

//////////////////////////////////
    //Removing duplicate values
//////////////////////////////////
    
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
    //console.log(uniqueArray);

//////////////////////////////////
//Setting up actor/show relationships with quantity of episodes
//////////////////////////////////
 
    var nodes = [];
        for(var i = 0; i < uniqueArray.length; i++) {
            nodes.push({id: i, actor: uniqueArray[i].actor, show: uniqueArray[i].show, value: uniqueArray[i].episodes});
        };
    //console.log(nodes);
    
//////////////////////////////////
//MATRIX TIME, TAKING THE RED PILL
//////////////////////////////////


});
