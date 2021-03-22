

var promises = [
    d3.csv("./data/mass_shooting_events_stanford_msa_release_06142016.csv", parseCSV), 
    d3.json("./data/stopasianhate.json"),
    d3.json("./data/blacklivesmatter.json"),
    d3.json("./geojson/gz_2010_us_040_00_20m.json")
];

Promise.all(promises).then(function(data) {

    console.log(data);

    var shootingsData = data[0];
    console.log(shootingsData)

    var blmData = data[2];
    var asianData = data[1];
    

    var usa = data[3];
    
    var twitterData = [];
    var separators = [' ', '\\\!', '-', '\\\(', '\\\)', '\\*', '/', ':', '\\\?', '\\\.', ','];

    for(var i = 0; i<blmData.length; i++){
        var text = blmData[i].text.split(new RegExp(separators.join('|'), 'g'));
        twitterData.push({id: i, location: blmData[i].place_info.location, longitude: blmData[i].x_average, latitude: blmData[i].y_average, text: text, tweetLength: text.length});
    }
    console.log(twitterData);
    var nested = d3.nest()
        .key(function(d){ return d.location; })
        .entries(twitterData)
    console.log(nested);

    var tweets = [];
    for(var i = 0; i < nested.length; i++) {
        tweets.push({quantity: nested[i].values.length, 
            latitude: nested[i].values[0].latitude, 
            longitude: nested[i].values[0].longitude, 
            id: i
        })
    }
    console.log(tweets);

    var width = document.querySelector("#chart").clientWidth;
    var height = document.querySelector("#chart").clientHeight;
    var margin = {top: 100, right: 100, left: 100, bottom: 200}

    var margin_context = {top: 650, right: 50, bottom: 100, left: 50};
    var height_context = height - margin_context.top - margin_context.bottom

    var svg = d3.select("#chart")
        .attr("width", width - margin.left - margin.right)
        .attr("height", height - margin.top - margin.bottom);

    var focus = svg.select("#focus");
    var context = svg.select("#context");

    context.append("text")
        .attr("x", margin_context.left)
        .attr("class", "label")
        .attr("y", margin_context.top - 20)
        .text("Brush to Filter by Tweet Length")
        .attr("fill", "white")

    var scaleDate = d3.scaleLinear()
        .domain([1966,2016])
        .range([margin_context.left, width-margin_context.right])

    var xScale = d3.scaleLinear()
        .domain([1,75])
        .range([margin_context.left, width-margin_context.right])

    shootingsData = shootingsData.sort(function(a,b) { return a.year - b.year; });

    // var histogramValues = d3.histogram()
    //     .value(function(d) {return d.year})
    //     .domain(scaleDate.domain())
    //     .thresholds(scaleDate.ticks(50))
    
    // bins = histogramValues(shootingsData);
    // console.log(bins)

    var histogramValues = d3.histogram()
        .value(function(d) {return d.tweetLength})
        .domain(xScale.domain())
        .thresholds(xScale.ticks(50))

    bins = histogramValues(twitterData);
    console.log(bins)

    var yScale = d3.scaleLinear()
        .range([height_context, 0])
        .domain([0, d3.max(bins, function(d) { return d.length; })])

    context.selectAll(".bar")
        .data(bins)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", d => xScale(d.x0))
        .attr("width", d => Math.max(0, (xScale(d.x1) - xScale (d.x0))/2))
        .attr("y", d => yScale(d.length))
        .attr("transform", `translate(0, ${margin_context.top})`)
        .attr("height", d => yScale(0) - yScale(d.length))
        .attr("fill", "#FEED02")

    var projection = d3.geoAlbers()
        .translate([width/2, height/3])
        .scale(1250);

    var path = d3.geoPath().projection(projection);
    
    focus.selectAll("path")
        .data(usa.features)
        .enter()
        .append("path")
            .attr("class", "state")
            .attr("d", path);

    var yearRange;
    var tweetLengths;
    
    // var rScale = d3.scaleSqrt()
    //     .domain([0,50])
    //     .range([0,25]);

    var rScale = d3.scaleSqrt()
        .domain([0,24])
        .range([0,25]);
    
    function updateMap(year) {
        var filtered_data = shootingsData.filter(function(d) {
            return d.year == year;
        });

        var c = focus.selectAll("circle")
            .data(filtered_data, function(d) {
                return d.id;
            });
        
        c.enter().append("circle")
            .attr("cx", function(d) {
                var proj = projection([d.longitude, d.latitude]);
                return proj[0];
            }).attr("cy", function(d){
                var proj = projection([d.longitude, d.latitude]);
                return proj[1];                
            }).attr("r", 0)
            .attr("opacity", 0.7)
            .attr("fill", "#CC0000")
        .merge(c)
            .transition()
            .duration(1000)
            .attr("cx", function(d) {
                var proj = projection([d.longitude, d.latitude]);
                return proj[0];
            }).attr("cy", function(d){
                var proj = projection([d.longitude, d.latitude]);
                return proj[1];                
            }).attr("r", function(d) { return rScale(d.victims); })
            .attr("opacity", 0.7)
            .attr("fill", "#CC0000");
        
        c.exit()
            .transition()
            .duration(1000)
            .attr("r", 0)
            .remove();

        yearLabel.text(year);

        focus.selectAll("circle")
            .on("mouseover", function(d){
                var cx = +d3.select(this).attr("cx") + 15;
                var cy = +d3.select(this).attr("cy") - 15;

                tooltip.style("visibility", "visible")
                    .style("left", cx + "px")
                    .style("top", cy + "px")
                    .html(d.location + "<br>" + d.date.toLocaleDateString("en-US"));
                svg.selectAll("circle")
                    .attr("opacity", 0.2);
                d3.select(this)
                    .attr("opacity", 0.7);
            
                }).on("mouseout", function(d) {
                tooltip.style("visibility", "hidden");
                svg.selectAll("circle")
                    .attr("opacity", 0.7);
            });
    }

        

    // var c = focus.selectAll("circle")
    //     .data(shootingsData, function(d) {
    //         return d.id;
    //     });
    
    // c.enter().append("circle")
    //     .attr("cx", function(d) {
    //         var proj = projection([d.longitude, d.latitude]);
    //         return proj[0];
    //     }).attr("cy", function(d){
    //         var proj = projection([d.longitude, d.latitude]);
    //         return proj[1];                
    //     }).attr("r", 0)
    //     .attr("opacity", 0.7)
    //     .attr("fill", "#CC0000")
    // .merge(c)
    //     .transition()
    //     .duration(1000)
    //     .attr("cx", function(d) {
    //         var proj = projection([d.longitude, d.latitude]);
    //         return proj[0];
    //     }).attr("cy", function(d){
    //         var proj = projection([d.longitude, d.latitude]);
    //         return proj[1];                
    //     }).attr("r", function(d) { return rScale(d.victims); })
    //     .attr("opacity", 0.7)
    //     .attr("fill", "#CC0000");
    
    // c.exit()
    //     .transition()
    //     .duration(1000)
    //     .attr("r", 0)
    //     .remove();

    var c = focus.selectAll("circle")
        .data(tweets, function(d) {
            return d.id;
        });
    
    c.enter().append("circle")
        .attr("cx", function(d) {
            var proj = projection([d.longitude, d.latitude]);
            return proj[0];
        }).attr("cy", function(d){
            var proj = projection([d.longitude, d.latitude]);
            return proj[1];                
        }).attr("r", 0)
        .attr("opacity", 0)
        //.style("mix-blend-mode", "multiply")
        .attr("fill", "#FEED02")
    .merge(c)
        .transition()
        .duration(500)
        .attr("cx", function(d) {
            var proj = projection([d.longitude, d.latitude]);
            return proj[0];
        }).attr("cy", function(d){
            var proj = projection([d.longitude, d.latitude]);
            return proj[1];                
        })
        .attr("r", function(d) { return rScale(d.quantity); })
        //.attr("r", 10)
        .attr("opacity", 0.5)
        .attr("fill", "#FEED02");
    
    c.exit()
        .transition()
        .duration(500)
        .attr("r", 0)
        .remove();

    var brush = d3.brushX()
        .extent([[margin_context.left, 0], [width -margin_context.right, height_context]])
        .on("brush", brushed)

    context.append("g")
        .attr("class", "brush")
        .attr("transform", function() {
            return (`translate(0, ${margin_context.top})`);
        })
        .call(brush)

    function brushed() {
        var s = d3.event.selection
        tweetLengths = s.map(xScale.invert, xScale);
        yearRange = s.map(scaleDate.invert, scaleDate);
        //console.log(yearRange)

        // var filtered_data = shootingsData.filter(function(d) {
        //     return d.year > yearRange[0] && d.year < yearRange[1];
        // });

        var filtered_data = twitterData.filter(function(d) {
            return d.tweetLength > tweetLengths[0] && d.tweetLength < tweetLengths[1];
        });


        console.log(filtered_data)

        nested = d3.nest()
            .key(function(d){ return d.location; })
            .entries(filtered_data)
        console.log(nested);

        tweets.length = 0;
        for(var i = 0; i < nested.length; i++) {
            tweets.push({quantity: nested[i].values.length, 
                latitude: nested[i].values[0].latitude, 
                longitude: nested[i].values[0].longitude
            })
        }

        var newPoints = focus.selectAll("circle")
            .data(tweets, function(d) {
                return d.id;
            });
    
        newPoints.enter().append("circle")
            .attr("cx", function(d) {
                var proj = projection([d.longitude, d.latitude]);
                return proj[0];
            }).attr("cy", function(d){
                var proj = projection([d.longitude, d.latitude]);
                return proj[1];                
            }).attr("r", 0)
            .attr("opacity", 0)
            .attr("fill", "#FEED02")
        .merge(newPoints)
            .transition()
            .duration(500)
            .attr("cx", function(d) {
                var proj = projection([d.longitude, d.latitude]);
                return proj[0];
            }).attr("cy", function(d){
                var proj = projection([d.longitude, d.latitude]);
                return proj[1];                
            }).attr("r", function(d) { return rScale(d.quantity); })
            .attr("opacity", 0.5)
            .attr("fill", "#FEED02");
        
        newPoints.exit()
            .transition()
            .duration(500)
            .attr("r", 0)
            .remove();
        }

    // focus.selectAll("circle")
    //     .on("mouseover", function(d){
    //         var cx = +d3.select(this).attr("cx") + 15;
    //         var cy = +d3.select(this).attr("cy") - 15;

    //         tooltip.style("visibility", "visible")
    //             .style("left", cx + "px")
    //             .style("top", cy + "px")
    //             .html(d.location + "<br>" + d.date.toLocaleDateString("en-US"));
    //         svg.selectAll("circle")
    //             .attr("opacity", 0.2);
    //         d3.select(this)
    //             .attr("opacity", 0.7);
        
    //         }).on("mouseout", function(d) {
    //         tooltip.style("visibility", "hidden");
    //         svg.selectAll("circle")
    //             .attr("opacity", 0.7);
    //     });

    // var tooltip = d3.select("#chart")
    //     .append("div")
    //     .attr("class", "tooltip");
    




});

function parseCSV(data) {
    var d = {};
    d.id = data.CaseID;
    d.location = data.Location;
    d.latitude = +data.Latitude;
    d.longitude = +data.Longitude;
    d.victims = +data["Total Number of Victims"];
    d.date = new Date(data.Date);
    d.year = d.date.getFullYear();

    return d;

}



