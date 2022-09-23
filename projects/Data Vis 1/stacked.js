/* defining variables for the width and heigth of the SVG */
const width = document.querySelector("#chart").clientWidth;
const height = document.querySelector("#chart").clientHeight;
const margin = { top: 50, left: 150, right: 50, bottom: 80 };

const legendWidth = document.querySelector("#legend").clientWidth;
const legendHeight = document.querySelector("#legend").clientHeight;

/*creating the actual SVG */
const svg = d3.select("#chart")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

const legend = d3.select("#legend")
    .append("svg")
    .attr("width", legendWidth)
    .attr("height", legendHeight);

d3.csv("./data/US_Textile_Waste.csv", parse).then(function (data) {


    /* filter subset of data, grabbing only the rows where the country = China or the US */
    //const filtered_data = data.filter(d => d.year === 2020);
    const keys = ["recycled", "combustion", "landfilled"]

    //set out colors based on our list of keys
    const colorScale = d3.scaleOrdinal()
        .domain(keys)
        .range(["blueviolet", "orangered", "lightgreen"])

    //group the data by continent
    // const by_trade = d3.groups(data, d=>d.year)
    // console.log(by_trade)

    // let nest_filter = d3.nest()
    //     .key(d => d.month)
    //     .rollup(d => d3.sum(d, g => g.value))
    //     .entries(filtered_data)
    // nest_filter.forEach(d => d.key = +d.key)

    //calculate the total population for each year (by continent)
    // let value_by_month = [] //an empty array to hold our new dataset
    // for(let i = 0; i < by_trade.length; i++) {
    //     let trade = by_trade[i][0]; //grab the name of each continent
    //     let nested = d3.nest() //create a nested data structure by year
    //         .key(d => d.year)
    //         .rollup(d => d3.sum(d, g => g.generation)) //add up populations of every country in that continent for each year
    //         .entries(by_trade[i][1])
    //     nested.forEach((d) => d.key = +d.key) //d3.nest generates keys as strings, we need these as numbers to use our linear xScale 
    //     for(let j = 0; j < nested.length; j++) {
    //         value_by_month.push({ //pushes the records created by the nesting function into our new array
    //             year: year
    //         })
    //     }
    // }

    //use the arquero library to pivot the data into an array of objects where each object has a year and a key for each continent
    // const by_month = aq.from(value_by_month)
    //     .groupby("year")
    //     .pivot("generation", "recycled")
    //     .objects()
    // console.log(by_month)

    //generate the dataset we'll feed into our chart
    const stackedData = d3.stack()
        .keys(keys)(data)
        .map((d) => {
            return d.forEach(v => v.key = d.key), d;
        })
    console.log(stackedData)

    //scales - xScale is a linear scale of the years
    let xValues = data.map(function (d) { return d.year; });
    xValues = d3.set(xValues).values();

    const xScale = d3.scaleLinear()
        .domain([d3.min(data, d => d.year), d3.max(data, d => d.year)])
        .range([margin.left, width - margin.right]);

    //yScale is a linear scale with a minimum value of 0 and a maximum bsed on the total population maximum
    const yScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d["recycled"] + d["combustion"] + d["landfilled"])])
        .range([height - margin.bottom, margin.top]);

    //draw the areas
    svg.selectAll("path")
        .data(stackedData)
        .enter()
        .append("path")
        .attr("fill", d => colorScale(d.key))
        .attr("d", d3.area()
            .x((d, i) => {
                return xScale(d.data.year);
            })
            //the starting and ending points for each section of the stack
            .y1(d => yScale(d[0]))
            .y0(d => yScale(d[1]))
        )

    //draw the x and y axis
    const xAxis = svg.append("g")
        .attr("class", "axis")
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom().scale(xScale).tickFormat(d3.format("Y"))
        .tickValues(xValues)); 
    // .ticks(10)
    // .tickValues([1960, 1970, 1980, 1990, 2000, 2005, 2010, 2015, 2017, 2018]);

    const yAxis = svg.append("g")
        .attr("class", "axis")
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft()
            .scale(yScale)
            .tickFormat(d3.format(".2s"))); //use d3.format to customize your axis tick format

    const xAxisLabel = svg.append("text")
        .attr("class", "axisLabel")
        .attr("x", width / 2)
        .attr("y", height - margin.bottom / 3)
        .text("Year")
        .attr("fill", "white");

    const yAxisLabel = svg.append("text")
        .attr("class", "axisLabel")
        .attr("transform", "rotate(-90)")
        .attr("x", -height / 2)
        .attr("y", margin.left / 2)
        .text("Weight (in thousands of tons)")
        .attr("fill", "white");

    //draw the legend
    const legendRects = legend.selectAll("rect")
        .data(keys)
        .enter()
        .append("rect")
        .attr("x", 0)
        .attr("y", (d, i) => i * 30)
        .attr("width", 20)
        .attr("height", 20)
        .attr("fill", d => colorScale(d))

    const legendLabels = legend.selectAll("text")
        .data(keys)
        .enter()
        .append("text")
        .attr("class", "legendLabel")
        .attr("fill", "white")
        .attr("x", 27)
        .attr("y", (d, i) => i * 30 + 15)
        .text(d => d)

    // let tooltip = d3.select("#chart")
    //     .append("div")
    //     .attr("class", "tooltip")

    svg.selectAll("myCircles")
        .data(data)
        .enter()
        .append("circle")
        .attr("fill", "white")
        .attr("stroke", "none")
        .attr("cx", function (d) { return xScale(d.year) })
        .attr("cy", function (d) { return yScale(d.generation) })
        .attr("r", 5)
    //     //tooltip interactivity
    //     .on("mouseover", function (d) { /*d is referencing each of the cirlces*/
    //     //grab the position of the node that we're hovering on    
    //         var cx = +d3.select(this).attr("cx") + 10;
    //         var cy = +d3.select(this).attr("cy") - 15;
    //     //make the tooltip visible
    //         tooltip.style("visibility", "visible")
    //             .style("left", cx + "px")
    //             .style("top", cy + "px")
    //             .text((d.generation) + " tons"); //the text that shows up in the tooltip
    //     //all other circles fall away slightly
    //         d3.selectAll("circle")
    //             .attr("opacity", 0.5)
    //     //the cirlce we're hovering on comes into focus
    //         d3.select(this)
    //             .attr("opacity", 1)
    //     })

    //     .on("mouseout", function () {
    //     //tooltip goes away
    //         tooltip.style("visibility", "hidden");
    //     //all circles return to full opacity
    //         d3.selectAll("circle")
    //             .attr("opacity", 1)
    //     });

    // var mainLine = svg.append("svg:path").attr("d", (data));
    // var mainLine1 = svg.append("svg:path").attr("d", (data));
    // circle1 = svg.append("circle")
    //     .attr("opacity", 0)
    //     .attr({
    //         r: 6,
    //         fill: 'darkred'
    //         });

    // svg.on('mousemove', function() {
    //     var xPos = d3.mouse(this)[0];
    //     d3.select(".verticalLine").attr("transform", function() {
    //         return "translate(" + xPos + ",0)";
    //         });
    //     var pathLength = mainLine.node().getTotalLength();
    //     var x = xPos;
    //     var beginning = x,
    //         end = pathLength,
    //         target;
    //     while (true) {
    //         target = Math.floor((beginning + end) / 2);
    //         xPos = mainLine.node().getPointAtLength(target);
    //         if ((target === end || target === beginning) && xPos.x !== x) {
    //             break;
    //         }
    //         if (pos.x > x)
    //             end = target;
    //         else if (pos.x < x)
    //             beginning = target;
    //         else
    //             break; //position found
    //         }
    //     circle.attr("opacity", 1)
    //             .attr("cx", x)
    //             .attr("cy", pos.y);
    //     console.log("x and y coordinate where vertical line intersects graph: " + [pos.x, pos.y]);
    //     console.log("data where vertical line intersects graph: " + [xScale.invert(pos.x), yScale.invert(pos.y)]);
    //     var pathLength1 = mainLine1.node().getTotalLength();
    //     var x1 = xPos;
    //     var beginning1 = x1,
    //             end1 = pathLength1,
    //             target1;
    //     while (true) {
    //         target1 = Math.floor((beginning1 + end1) / 2);
    //         pos1 = mainLine1.node().getPointAtLength(target1);
    //         if ((target1 === end1 || target1 === beginning1) && pos1.x !== x1) {
    //             break;
    //         }
    //         if (pos1.x > x1)
    //             end1 = target1;
    //         else if (pos1.x < x1)
    //             beginning1 = target1;
    //         else
    //             break; //position found
    //     }
    //     circle1.attr("opacity", 1)
    //             .attr("cx", x1)
    //             .attr("cy", pos1.y);
    //     console.log("data where vertical line intersects graph2: " + [xScale1.invert(pos1.x), yScale1.invert(pos1.y)]);
    // });

    var hoverLineGroup = svg.append("g")
        .attr("class", "hover-line");
    var hoverLine = hoverLineGroup
        .append("line")
        .attr("stroke", "white")
        .attr("x1", 10).attr("x2", 10)
        .attr("y1", 0).attr("y2", height);
    var hoverTT = hoverLineGroup.append('text')
        .attr("class", "hover-tex capo")
        .attr('dy', "0.35em");
    var cle = hoverLineGroup.append("circle")
        .attr("r", 4.5);
    var hoverTT2 = hoverLineGroup.append('text')
        .attr("class", "hover-text capo")
        .attr('dy', "0.55em");
    hoverLineGroup.style("opacity", 1e-6);
    var rectHover = svg.append("rect")
        .data(data)
        .attr("fill", "none")
        .attr("class", "overlay")
        .attr("width", width)
        .attr("height", height);
    svg
        .on("mouseout", hoverMouseOff)
        .on("mousemove", hoverMouseOn);
    var bisectDate = d3.bisector(function (d) { return d.year; }).left;

    function hoverMouseOn() {
        var mouse_x = d3.mouse(this)[0];
        var mouse_y = d3.mouse(this)[1];
        var graph_y = yScale.invert(mouse_y);
        var graph_x = xScale.invert(mouse_x);
        var mouseDate = xScale.invert(mouse_x);
        var i = bisectDate(data, mouseDate); // returns the index to the current data item
        var d0 = data[i - 1]
        var d1 = data[i];
        // work out which date value is closest to the mouse
        var d = mouseDate - d0[0] > d1[0] - mouseDate ? d1 : d0;
        hoverTT.text("Gernation: " + d.generation)
            .attr("stroke", "white");
        hoverTT.attr('x', mouse_x + 5);
        hoverTT.attr('y', yScale(d.generation) - 50);
        // hoverTT2.text("Frequency: " + Math.round(d.generation * 100)/100)
        //     .attr('x', mouse_x)
        //     .attr('y', yScale(d.generation) + 10);
        cle
            .attr('x', mouse_x)
            .attr('y', mouse_y);
        hoverLine.attr("x1", mouse_x).attr("x2", mouse_x)
        hoverLineGroup.style("opacity", 1);
    }
    function hoverMouseOff() {
        hoverLineGroup.style("opacity", 1e-6);
    }
    drawGraph();

})

//get the data in the right format
function parse(d) {
    return {
        recycled: +d.recycled, //cotton, silk, wool, etc.
        combustion: +d.combustion, //this is a binary value
        landfilled: +d.landfilled, //yarn, apparel, home, etc.
        generation: +d.generation, //type of yarn, type of home
        year: +d.year //we want this as a number
    }
};