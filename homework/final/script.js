
d3.csv("./data/themoviedb_2019_small.csv", function(data) {
    
    //console.log(data);

    data.forEach(function(d){
        d.year = +d.year; 
    });

    var movies2019 = [];
    for(var i = 0; i < data.length; i++) {
        var movies = [data[i].title];
        movies.forEach(function(val) {
            if(movies2019.indexOf(val) < 0) {
                movies2019.push(val);
            }
        }
        )
    }
    //console.log(movies2019);

    var stars = [];
    for(var i = 0; i < data.length; i++) {
        var name = [data[i].actor];
        name.forEach(function(val) {
            if(stars.indexOf(val) < 0) {
                stars.push(val);
            }
        }
        )
    }
    console.log(stars);

    /*var allShows = [];
    for(var i = 0; i < data.length; i++) {
        var show = [data[i].show];
        show.forEach(function(val) {
            if(allShows.indexOf(val) < 0) {
                allShows.push(val);
            }
        }
        )
    }
    console.log(allShows);*/
    /*var shows = [];
    for(var i = 0; i < data.length; i++) {
        var actorA = data[i].actor;
        var showA = data[i].show;
        if(shows.indexOf(showA) < 0) {
            shows.push({show: showA, actor: actorA});
        }
    }
    console.log(shows);*/

    




});
