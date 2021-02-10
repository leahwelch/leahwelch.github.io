
d3.csv("./data/covidcookery.csv", parseCSV).then(function(data) {

    var width = document.querySelector("#chart").clientWidth;
    var height = document.querySelector("#chart").clientHeight;
    var margin = {top: 100, left: 150, right: 50, bottom: 50};
    var svg = d3.select("#chart")
        .append("svg")
        .attr("width", width)
        .attr("height", height);
    console.log(data);

    // var descWords = [];
    // for(var i = 0; i < data.length; i++) {
    //     var words = data[i].description;
    //     words.forEach(function(val) {
    //         descWords.push({word: val});
    //     }
    //     )
    // }
    // descWords = descWords.map(d => d.word.toLowerCase());

    var parseTime = d3.timeParse("%d/%m/%Y");
    var ingredients = ["chicken", "cake", "bread", "chocolate", "cheese", "pizza", "sauce", "garlic", "rice", "cream"];
    var chicken_data = [];

    for(var i = 0; i < data.length; i++) {
        var words = data[i].description;
        if(words.includes("chicken") || words.includes("Chicken")) {
            chicken_data.push({date: parseTime(data[i].date)})
        }
    }
    console.log(chicken_data);

    top_ingredients = [];
    for(var j = 0; j < ingredients.length; j++) {
        var myArray = [];
        for(var i = 0; i < data.length; i++) {
            var words = data[i].description;
            if(words.includes(ingredients[j])) {
                myArray.push({ingredient: ingredients[j], date: parseTime(data[i].date)})
            }
        }
        top_ingredients.push(myArray);
    }
    console.log(top_ingredients);

    var xScale = d3.scaleTime()
      .domain(d3.extent(data, function(d) { return parseTime(d.date); }))
      .range([margin.left, width-margin.right]);

    var yScale = d3.scaleLinear()
      .range([height-margin.top-margin.bottom, margin.top])
      .domain([0, 1]);

    var kde = kernelDensityEstimator(kernelEpanechnikov(7), xScale.ticks(60))
    var density =  kde( chicken_data.map(function(d){  return d.date; }) );
    console.log(density)
    var allDensity = []
    for (j = 0; j < ingredients.length; j++) {
        var key = ingredients[j];
        var density;
        for(var i = 0; i < top_ingredients[j].length; i++) {
          var myArray = top_ingredients[j];
          density = kde( myArray.map(function(d){  return myArray[i].date; }) )
          allDensity.push({key: key, density: density})
        }
        
    }
    

    
    


    

    // var words = [];
    // for(var i = 0; i < descWords.length; i++) {
    //     var wordA = descWords[i];
    //     words.push({word: wordA})
    // }

    // var nested = d3.nest()
    //     .key(function(d) { return d.word; })
    //     //.key(function(d) { return d.DAY_OF_WEEK; })
    //     .rollup(function(v) { return v.length;})
    //     .entries(words)
    //     .sort(function(a,b) { return b.value - a.value; });

    //     console.log(nested);
    // var neststring = JSON.stringify(nested);
    // console.log(neststring);



    console.log(allDensity);
    // var line = d3.line()
    //         .x(function(d) { return xScale(d.Year); })
    //         .y(function(d) { return yScale(d.Amount); })
    //         .curve(d3.curveLinear); 

    var yName = d3.scaleBand()
        .domain(ingredients)
        .range([margin.top, height-margin.top-margin.bottom]) 
        .paddingInner(1)
      svg.append("g")
        .call(d3.axisLeft(yName).tickSize(0))
        .select(".domain").remove()

    // var area = d3.area()
    //     .curve(d3.curveBasis)
    //     .x(function(d) { return xScale(d[0]); })
    //     .y1(function(d) { return yScale(d[1]); })
    //     .y0(height-margin.bottom);

    // var path = svg.append("path")
    //     .datum(density)
    //     .attr("transform", function(d){return("translate(0," + (yName(d.key)-height) +")" )})
    //     .attr("d", area)
    //     .attr("stroke", "black")
    //     .attr("fill","orange");

    svg.selectAll("areas")
    .data(allDensity)
    .enter()
    .append("path")
      .attr("transform", function(d){return("translate(0," + (yName(d.key)-height+margin.top+margin.bottom) +")" )})
      .datum(function(d){return(d.density)})
      .attr("fill", "none")
      .attr("stroke", "#000")
      .attr("stroke-width", 1)
      .attr("d",  d3.line()
          .curve(d3.curveBasis)
          .x(function(d) { return xScale(d[0]); })
          .y(function(d) { return yScale(d[1]); })
      )

    var xAxis = svg.append("g")
      .attr("class","axis")
      .attr("transform", `translate(0,${height-margin.bottom})`)
      .call(d3.axisBottom().scale(xScale));

    
    // svg.append("g")
    //     .call(d3.axisLeft(yName));

    var yAxis = svg.append("g")
      .attr("class","axis")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft().scale(yName));



    });


function parseCSV(data) {
    var d = {};
    //d.title = data.title;
    //d.id = data.VideoID;
    d.description = data.description;
    var parseTime = d3.timeParse("%d/%m/%Y");
    //d.date = parseTime(data.date);
    d.date = data.date;
    //d.thumbnail = data.thumbnail;

    var separators = [' ', '\\\!', '-', '\\\(', '\\\)', '\\*', '/', ':', '\\\?', '\\\.', ','];
    //d.title = d.title.split(" ");
    //d.title = data.title.split(new RegExp(separators.join('|'), 'g'));
    d.description = d.description.split(new RegExp(separators.join('|'), 'g'));

    
    return d;
}

// function kernelDensityEstimator(kernel, X) {
//     return function(V) {
//       return X.map(function(x) {
//         return [x, d3.mean(V, function(v) { return kernel(x - v); })];
//       });
//     };
//   }
//   function kernelEpanechnikov(k) {
//     return function(v) {
//       return Math.abs(v /= k) <= 1 ? 0.75 * (1 - v * v) / k : 0;
//     };
//   }

function kernelDensityEstimator(kernel, X) {
  return function(V) {
    return X.map(function(x) {
      return [x, d3.mean(V, function(v) { return kernel(x - v); })];
    });
  };
}
function kernelEpanechnikov(k) {
  return function(v) {
    return Math.abs(v /= k) <= 1 ? 0.75 * (1 - v * v) / k : 0;
  };
}
