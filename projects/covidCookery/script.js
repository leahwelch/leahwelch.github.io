
//d3.csv("./data/covidcookery.csv", parseCSV).then(function(data) {
d3.csv("./data/covidcookery.csv").then(function(data) {

    var width = document.querySelector("#chart").clientWidth;
    var height = document.querySelector("#chart").clientHeight;
    var margin = {top: 50, left: 150, right: 50, bottom: 150};
    var svg = d3.select("#chart")
        .append("svg")
        .attr("width", width)
        .attr("height", height);
    console.log(data);

    //Get number of posts per day
    var nested = d3.nest()
        .key(function(d) { return d.date; })
        .rollup(function(v) { return v.length;})
        .entries(data)

        console.log(nested);
    
    var parseTime = d3.timeParse("%d/%m/%Y");
    
    var xScale = d3.scaleTime()
      .domain(d3.extent(nested, function(d) { return parseTime(d.key); }))
      .range([margin.left, width-margin.right]);

    var yScale = d3.scaleLinear()
      .domain([0, d3.max(nested, function(d) { return +d.value; })])
      .range([height-margin.bottom, margin.top]);

    var line = d3.line()
      .x(function(d) { return xScale(parseTime(d.key)); })
      .y(function(d) { return yScale(d.value); })
      .curve(d3.curveLinear);

    var xAxis = svg.append("g")
      .attr("class","axis")
      .attr("transform", `translate(0,${height-margin.bottom})`)
      .call(d3.axisBottom().scale(xScale));

    var yAxis = svg.append("g")
      .attr("class","axis")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft().ticks(10).scale(yScale));
    var path = svg.append("path")
      .datum(nested)
      .attr("d", function(d) { return line(d)})
      .attr("stroke","orange")
      .attr("fill", "none");



    });


function parseCSV(data) {
    var d = {};
    //d.title = data.title;
    //d.id = data.VideoID;
    //d.body = data.body;
    var parseTime = d3.timeParse("%d/%m/%Y");
    d.date = parseTime(data.date);
    //d.thumbnail = data.thumbnail;

    //var separators = [' ', '\\\!', '-', '\\\(', '\\\)', '\\*', '/', ':', '\\\?', '\\\.', ','];
    //d.title = d.title.split(" ");
    //d.title = data.title.split(new RegExp(separators.join('|'), 'g'));
    //d.body = d.body.split(new RegExp(separators.join('|'), 'g'));

    
    return d;
}
