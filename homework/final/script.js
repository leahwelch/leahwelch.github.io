
d3.csv("./data/themoviedb_2019.csv", function(data) {
    
    console.log(data);

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
    console.log(movies2019);

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
    




});
