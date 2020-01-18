var realTimeURL = "https://whiteboard.datawheel.us/api/google-analytics/realtime/111999474";
var frequency = 10 * 1000; //10 seconds

function fetchData() {
    d3.json(realTimeURL, function(error,users) {
        console.log("users:", users);
        d3.select("#users").html(users);

        var data=[]
        data.push({value: users});
        console.log(data);

        function convert2numbers(d,i) {
            d.value = +d.value;
        }

        var width = document.querySelector("#chart").clientWidth;
        var height = document.querySelector("#chart").clientHeight;
        var margin = {top: 50, left: 150, right: 50, bottom: 150};

        var svg = d3.select("#chart")
            .append("svg")
            .attr("width", width)
            .attr("height", height);

        var lines = svg.selectAll(".myline")
            .data(data)
            .enter()
            .append("line")
              .attr("x1", margin.left)
              .attr("x2", function(data) { return (data.value*5); })
              .attr("y1", height/2)
              .attr("y2", height/2)
              .attr("class", "myline")
              .attr("stroke", "#A7A7A7")
              .attr("stroke-width", 5);

        var newLines = svg.selectAll(".myline").data(data);

        newLines.enter().append("line")
            .attr("x1", margin.left)
            .attr("x2", function(data) { return (data.value*5); })
            .attr("y1", height/2)
            .attr("y2", height/2)
        .merge(newLines)
            .transition()
                .attr("x1", margin.left)
                .attr("x2", function(data) { return (data.value*5); })
                .attr("y1", height/2)
                .attr("y2", height/2)
            .attr("stroke", "#A7A7A7")
            .attr("stroke-width", 5);
        
        newLines.exit()
            .transition()
            .remove();
    });
}

fetchData();
setInterval(fetchData, frequency);

