
d3.csv("./data/themoviedb_2019.csv", function(data) {
    
    console.log(data);

    data.forEach(function(d){
        d.year = d.year.substring(1); 
        //console.log(d.year);
    })
    




});
