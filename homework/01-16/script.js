var realTimeURL = "https://whiteboard.datawheel.us/api/google-analytics/realtime/111999474";
var frequency = 10 * 1000; //10 seconds

function fetchData() {
    d3.json(realTimeURL, function(error,users) {
        console.log("users:", users);
        //d3.select("#users").html(users);

        var data=[]
        data.push(users);
        console.log(data);

        /*function convert2numbers(d,i) {
            users = +users;
        }*/
        console.log(users);

        var width = document.querySelector("#chart").clientWidth;
        var height = document.querySelector("#chart").clientHeight;
        var margin = {top: 50, left: 150, right: 50, bottom: 150};

        var svg = d3.select("#chart")
            .append("svg")
            .attr("width", width)
            .attr("height", height);

        var bar = svg.selectAll("rect")   
            .data(data)
            .enter()
            .append("rect")
                .attr("x", margin.left)
                .attr("y", margin.top) 
                .attr("width", users)
                .attr("height", 20)
                .attr("fill", "pink");

        var b = svg.selectAll("rect")
            .data(data);

        b.enter().append("rect")
            .attr("x", margin.left)
            .attr("y", margin.top) 
            .attr("width", 0)
            .attr("height", 0)
            .attr("fill", "pink")
          .merge(b)
            .transition()
            .duration(1500)
            .delay(1000)
            .attr("x", margin.left)
            .attr("y", margin.top) 
            .attr("width", 0)
            .attr("height", 0)
            .attr("fill", "pink"); 
      
          b.exit()
              .transition()
              .duration(1500)
              .delay(1000)
              .attr("width", 0)
              .attr("height", 0)
              .remove();
    });
}

fetchData();
setInterval(fetchData, frequency);

