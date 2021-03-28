

var promises = [
    d3.csv("./data/mass_shooting_events_stanford_msa_release_06142016.csv", parseCSV), 
    d3.json("./data/stopasianhate.json"),
    d3.json("./data/blacklivesmatter.json"),
    d3.json("./geojson/gz_2010_us_040_00_20m.json")
];

var blmBtn = d3.select("#blmBtn");
var asianBtn = d3.select("#asianBtn");

var blmFill = "#FEED02";
var asianFill = "#F4683A";

function showVis(evt) {
    // Declare all variables
    var i, tablinks;
  
    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
  
    // Show the current tab, and add an "active" class to the button that opened the tab
    evt.currentTarget.className += " active";
  }

var width = document.querySelector("#chart").clientWidth;
var height = document.querySelector("#chart").clientHeight;
var margin = {top: 100, right: 100, left: 100, bottom: 0}

var margin_context = {top: 650, right: 50, bottom: 40, left: 50};
var height_context = height - margin_context.top - margin_context.bottom

var svg = d3.select("#chart")
    .attr("width", width - margin.left - margin.right)
    .attr("height", height - margin.top - margin.bottom);

var focus = svg.select("#focus");
var context = svg.select("#context");

Promise.all(promises).then(function(data) {

    console.log(data);

    var shootingsData = data[0];
    console.log(shootingsData)

    var blmData = data[2];
    var asianData = data[1];
    var usa = data[3];

    var separators = [' ', '\\\!', '-', '\\\(', '\\\)', '\\*', '/', ':', '\\\?', '\\\.', ','];

    var projection = d3.geoAlbers()
        .translate([width/2-100, height/3 + 30])
        .scale(1350);

    var path = d3.geoPath().projection(projection);

    focus.selectAll("path")
        .data(usa.features)
        .enter()
        .append("path")
            .attr("class", "state")
            .attr("d", path);

    context.append("rect")
        .attr("class", "contextBG")
        .attr("x", margin_context.left)
        .attr("y", margin_context.top)
        .attr("height", height_context)
        .attr("width", width-margin_context.right)
        .attr("fill", "#272727")
    
        
    context.append("text")
        .attr("x", margin_context.left + 20)
        .attr("class", "miniTitle")
        .attr("y", margin_context.top + 30)
        .text("How Much Are People Writing?")
        .attr("fill", "white")

    context.append("text")
        .attr("x", margin_context.left + 20)
        .attr("class", "histoText")
        .attr("y", margin_context.top + 60)
        .text("This histogram shows the distribution of")
        .attr("fill", "white")

    context.append("text")
        .attr("x", margin_context.left + 20)
        .attr("class", "histoText")
        .attr("y", margin_context.top + 82)
        .text("tweets by length from single hashtag to")
        .attr("fill", "white")

    context.append("text")
        .attr("x", margin_context.left + 20)
        .attr("class", "histoText")
        .attr("y", margin_context.top + 104)
        .text("lengthy prose.")
        .attr("fill", "white")


        
        

    
    
    // context.append("text")
    //     .attr("x", width/2)
    //     .attr("class", "label")
    //     .attr("y", height_context + margin_context.top + 30)
    //     .text("Tweet Length (words)")
    //     .style("text-align", "center")
    //     .attr("fill", "white")

    function draw(dataset, col) {

        console.log(dataset)
        var twitterData = [];
        for(var i = 0; i<dataset.length; i++){
            var text = dataset[i].text.split(new RegExp(separators.join('|'), 'g'));
            var originalTweet = dataset[i].text;
            twitterData.push({id: i, location: dataset[i].place_info.location, longitude: dataset[i].x_average, latitude: dataset[i].y_average, text: text, tweetLength: text.length, tweet: originalTweet});
        }
    
        var nested = d3.nest()
            .key(function(d){ return d.location; })
            .entries(twitterData)

        console.log(nested);
    
        var tweets = [];
        for(var i = 0; i < nested.length; i++) {
            tweets.push({quantity: nested[i].values.length, 
                latitude: nested[i].values[0].latitude, 
                longitude: nested[i].values[0].longitude, 
                id: i, 
                location: nested[i].key
            })
        }
        console.log(tweets)
    
        var xScale = d3.scaleLinear()
            .domain([1,75])
            .range([margin_context.left + (width-margin_context.right)/4, width-margin_context.right])
    
        var histogramValues = d3.histogram()
            .value(function(d) {return d.tweetLength})
            .domain(xScale.domain())
            .thresholds(xScale.ticks(50))
    
        bins = histogramValues(twitterData);
    
        var yScale = d3.scaleLinear()
            .range([height_context-40, margin_context.bottom -10])
            .domain([0, d3.max(bins, function(d) { return d.length; })])

        var xAxis = context.append("g")
            .attr("class", "axis")
            .attr("transform", `translate(0,${height_context + margin_context.top-30})`)
            .call(d3.axisBottom().scale(xScale))

        function zeroState(selection) {
            selection
                .attr("height", 0)
                .attr("y", yScale(0));
        }
    
        var bars = context.selectAll(".bar")
            .data(bins)

        var barEnter = bars
            .enter()
            .append("rect")
            .attr("class", "bar")
            .call(zeroState)

        bars.merge(barEnter)  
            .attr("x", d => xScale(d.x0))
            .attr("width", d => Math.max(0, (xScale(d.x1) - xScale (d.x0))/2))
            .attr("transform", `translate(0, ${margin_context.top})`)
            .transition()
            .duration(500)
            .attr("y", d => yScale(d.length))
            .attr("height", d => yScale(0) - yScale(d.length))
            .attr("fill", col);

        bars.exit()
            .transition()
            .duration(500)
            .call(zeroState)
            .remove();
    
    
        var tweetLengths;
    
        var rScale = d3.scaleSqrt()
            .domain([0,24])
            .range([0,25]);
    
        var c = focus.selectAll(".circle")
            .data(tweets);

        var enter = c.enter().append("circle")
            .attr("class", "circle")  
            .attr("r", 0)
        
        c.merge(enter)
            
            .attr("cx", function(d) {
                var proj = projection([d.longitude, d.latitude]);
                return proj[0];
            }).attr("cy", function(d){
                var proj = projection([d.longitude, d.latitude]);
                return proj[1];                
            })
            .transition()
            .duration(500)
            .attr("r", function(d) { return rScale(d.quantity); })
            .attr("opacity", 0.3)
            .attr("fill", col);
        
        c.exit()
            .transition()
            .duration(500)
            .attr("r", 0)
            .attr("opacity", 0)
            .remove();

        var tweetList = [];

        svg.selectAll(".circle").on("mouseover", function(d){
            svg.selectAll(".circle")
                .attr("opacity", 0.2);
            d3.select(this)
                .attr("opacity", 0.8);
            
            }).on("click", function(d) {
                d3.selectAll(".dynamicTweet").remove();
                var loc = d.location;
                document.getElementById("location").innerHTML = loc;
            
                var filtered_tweets = nested.filter(function(d) {
                    return d.key === loc;
                });
                //console.log(filtered_tweets)
                for(var i = 0; i < filtered_tweets[0].values.length; i++) {
                    tweetList.push(filtered_tweets[0].values[i].tweet)
                }
                console.log(tweetList)
                for(var i = 0; i < tweetList.length; i++) {
                    document.getElementById("tweets").innerHTML +=
                        `<p class="dynamicTweet">${tweetList[i]}</p>`
                }
                
            })
            .on("mouseout", function(d) {
            svg.selectAll(".circle")
                .attr("opacity", 0.3);
                tweetList.length = 0;
                
        });
    
        // var brush = d3.brushX()
        //     .extent([[margin_context.left, 0], [width -margin_context.right, height_context]])
        //     .on("brush", brushed)
    
        // context.append("g")
        //     .attr("class", "brush")
        //     .attr("transform", function() {
        //         return (`translate(0, ${margin_context.top})`);
        //     })
        //     .call(brush)
    
        // function brushed() {
        //     var s = d3.event.selection

        //     tweetLengths = s.map(xScale.invert, xScale);
    
        //     var filtered_data = twitterData.filter(function(d) {
        //         return d.tweetLength > tweetLengths[0] && d.tweetLength < tweetLengths[1];
        //     });
    
        //     nested = d3.nest()
        //         .key(function(d){ return d.location; })
        //         .entries(filtered_data)
        //     console.log(nested);
    
        //     tweets.length = 0;
        //     for(var i = 0; i < nested.length; i++) {
        //         tweets.push({quantity: nested[i].values.length, 
        //             latitude: nested[i].values[0].latitude, 
        //             longitude: nested[i].values[0].longitude
        //         })
        //     }
    
        //     var newPoints = focus.selectAll("circle")
        //         .data(tweets, function(d) {
        //             return d.id;
        //         });
        
        //     newPoints.enter().append("circle")
        //         .attr("cx", function(d) {
        //             var proj = projection([d.longitude, d.latitude]);
        //             return proj[0];
        //         }).attr("cy", function(d){
        //             var proj = projection([d.longitude, d.latitude]);
        //             return proj[1];                
        //         }).attr("r", 0)
        //         .attr("opacity", 0)
        //         .attr("fill", col)
        //     .merge(newPoints)
        //         .transition()
        //         .duration(500)
        //         .attr("cx", function(d) {
        //             var proj = projection([d.longitude, d.latitude]);
        //             return proj[0];
        //         }).attr("cy", function(d){
        //             var proj = projection([d.longitude, d.latitude]);
        //             return proj[1];                
        //         }).attr("r", function(d) { return rScale(d.quantity); })
        //         .attr("opacity", 0.3)
        //         .attr("fill", col);
            
        //     newPoints.exit()
        //         .transition()
        //         .duration(500)
        //         .attr("r", 0)
        //         .remove();

        //     if (!event.selection) return;
        //     }
    }

    blmBtn.on("click", function() {
        draw(blmData, blmFill);
    });
    
    asianBtn.on("click", function() {
        draw(asianData, asianFill);
    });
    
    draw(blmData, blmFill);

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



