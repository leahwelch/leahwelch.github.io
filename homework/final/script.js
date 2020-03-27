
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
    //console.log(stars);

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
    console.log(shows);

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
    console.log(uniqueArray);

//////////////////////////////////
//Setting up actor/show relationships with quantity of episodes
//////////////////////////////////
 
    var nodes = [];
        for(var i = 0; i < uniqueArray.length; i++) {
            nodes.push({id: i, actor: uniqueArray[i].actor, show: uniqueArray[i].show, value: uniqueArray[i].episodes});
        };
    console.log(nodes);
    
//////////////////////////////////
//MATRIX TIME, TAKING THE RED PILL
//////////////////////////////////

//////////////////////////////////
//trying to make the first array in the matrix
//need to push in 0's for every show in the show list first
//////////////////////////////////

    var newArray = [];
        for(var i = 0; i < shows.length; i++) {
            newArray.push(0);
        }

//Now I need to iterate over the list of actors and push either a 0 or the # of episodes
        
        for(var i = 0; i < stars.length; i++) {
            var starA = stars[i];
            if(starA === nodes[0].actor){
                newArray.push(nodes[0].value)
            } else {
                newArray.push(0)
            }
        }
        //console.log(newArray);

//Position of the actors is getting jumbled by the if/else
//the first values pushed in are the ones with a match, then all of the zeros

//YAY! this combo is creating the row correctly :)
//OK, now I have to automate the various parts and then push each row into my matrix

        var newArray2 = [];
        for(var i = 0; i < (shows.length + nodes[1].id); i++) { //nodes[1].id needs to become nodes[i].id where i=index of shows, so nest this for loop inside of a for loop iterating over shows
            newArray2.push(0);
        }  
        for(var i = 0; i < stars.length; i++) {
            var starA = stars[i];
            if(starA === nodes[1].actor){
                newArray2.push(nodes[1].value)
            } else {
                newArray2.push(0)
            }
        }
        for(var i = 0; i < nodes[1].id; i++) {
            newArray2.pop();
        }
        console.log(newArray2);

    




});
