var realTimeURL = "https://whiteboard.datawheel.us/api/google-analytics/realtime/random";
var frequency = 10 * 1000; //10 seconds


var width = document.querySelector("#chart").clientWidth;
var height = document.querySelector("#chart").clientHeight;
var margin = {top: 50, left: 150, right: 150, bottom: 150};

var svg = d3.select("#chart")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

var settings = {
    margin:margin, width:width, height:height, svg:svg
    }


initialData(settings);
updateData(settings);
setInterval(updateData, frequency);

function initialData(settings) {
    d3.json(realTimeURL, function(error,users) {

        var data=[]
        data.push(users);

        var bar = svg.selectAll("rect")   
            .data(data)
            .enter()
            .append("rect")
                .attr("x", margin.left)
                .attr("y", margin.top)
                .attr("width", users*3)
                .attr("height", users*3)
                .attr("fill", "red");
        });
    }

function updateData(settings) {
    d3.json(realTimeURL, function(error,users) {

        var data=[]
        data.push(users);

        var newBar = svg.selectAll("rect")   
            .data(data);
        newBar.enter().append("rect")
            .attr("x", margin.left)
            .attr("y", margin.top)
            .attr("width", users*3)
            .attr("height", users*3)
            .attr("fill", "red")
        .merge(newBar)
            .transition()
            .attr("width", users*3)
            .attr("height", users*3)
            .attr("fill", "red");
        newBar.exit()
            .transition()
            .attr("width", 0)
            .remove();
        });
    }
