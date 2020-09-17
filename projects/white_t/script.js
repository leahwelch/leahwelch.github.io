d3.csv("./data/t_shirt.csv", function(data) {
    
    data.forEach(function(d){
        d.value = +d.value; 
    });

    //////////////////////////////////
    //List of goals
    //////////////////////////////////
        
    var goals = [];
    for(var i = 0; i < data.length; i++) {
        var goalList = [data[i].goal];
        goalList.forEach(function(val) {
            if(goals.indexOf(val) < 0) {
             goals.push(val);
            }
        }
        )
    }
    console.log(goals);

    //////////////////////////////////
    //List of industries
    //////////////////////////////////
        
    var industries = [];
    for(var i = 0; i < data.length; i++) {
        var areas = [data[i].industry];
        areas.forEach(function(val) {
            if(industries.indexOf(val) < 0) {
             industries.push(val);
            }
        }
        )
    }
    console.log(industries);

    //////////////////////////////////
    //Setting up goal/industry relationships
    //////////////////////////////////
    
    var nodes = [];
    for(var i = 0; i < data.length; i++) {
        nodes.push({id: i, goal: data[i].goal,industry: data[i].industry, value: data[i].value});
    };
    console.log(nodes);
});