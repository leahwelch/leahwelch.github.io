var eras = [
        {era: "Winnetka, IL", start: 1, end: 3},
        {era: "NYU", start: 3, end: 7, start_year: 9.2006, location: "NYU"},
        {era: "Freshman Year, Middlebury College", start: 7, end: 11, start_year: 9.2007, location: "Middlebury, VT"},
        {era: "Sophomore Year, Middlebury College", start: 11, end: 15},
        {era: "Study Abroad, London", start: 15, end: 19, start_year: 9.2009, location: "London, England"},
        {era: "Senior Year, Middlebury College", start: 19, end: 23, start_year: 9.2010, location: "Middlebury, VT"},
        {era: "Los Angeles", start: 23, end: 34, start_year: 6.2011, location: "Los Angeles, CA"},
        {era: "Moved in with Steven, Nottingham", start: 34, end: 35, start_year: 6.2014, location: "Nottingham, England"},
        {era: "Hangzhou, China", start: 35, end: 43, start_year: 9.2014, location: "Hangzhou, China"},
        {era: "The Orme School, Mayer, AZ", start: 43, end: 55, start_year: 9.2016, location: "Mayer, AZ"},
        {era: "Roslindale, MA", start: 55, end: 59, start_year: 6.2019, location: "Roslindale, MA"},
        {era: "Lawrence, MA", start: 59, end: 60, start_year: 6.2020, location: "Lawrence, MA"}
        
    ];



    var era_start = [];
    for(i = 0; i < eras.length; i++) {
        era_start.push(eras[i].start);
    }
    console.log(era_start);
    var width = document.querySelector(".graphic__vis").clientWidth;
    var widthT = document.querySelector(".graphic__prose").clientWidth;
    var heightT = document.querySelector(".graphic__prose").clientHeight;
    var marginT = {top: 0, left: 10, right: 0, bottom: 0};
    
    var svgT = d3.select(".graphic__prose")
        .append("svg")
        .attr("width", widthT)
        .attr("height", heightT);
    var yScaleT = d3.scaleLinear()
        .domain([1, 60])
        .range([0, heightT]);
    
    var yAxisGenerator = d3.axisRight(yScaleT)
        .tickSize(-14)
        .ticks(60);
    
    var yAxis = svgT.append("g")
        .attr("class","axis")
        .attr("transform", `translate(${marginT.left + 7},0)`)
        .call(yAxisGenerator);
    
    yAxis.selectAll(".tick text")
        .attr("class", "sideLabels")
        .style("visibility", "hidden");
    
    var lineT = svgT.append("line")
        .attr("x1", marginT.left)
        .attr("x2", marginT.left)
        .attr("y1", function() {
            return yScaleT(1);
        })
        .attr("y2", function() {
            return yScaleT(60);
        })
        .attr("stroke", "#a08875");
    

    
    d3.select(".graphic__prose")
        .selectAll(".trigger")
        .data(eras)
        .join("div")
        .attr("class", function(d) {
            if(d.start == 1 || d.end == 60) {
                return "notTrigger";
            } else {
                return "trigger";
            }
        })
        .attr("id", function(d) {
            return d.start;
        })
        .attr('data-step', function(d,i) {
            if(d.start !== 1 && d.end !== 60) {
                return i;
            } 
            
        })
        
        .style("top", function(d) { return yScaleT(d.start) + 26 + "px"; }) //this is the problem right here
        .style("left", d => width + widthT/2 - 14 + "px")
        .style("visibility", function(d) {
            if(d.start == 1 || d.end == 60) {
                return "hidden";
            } else {
                return "visible";
            }
        })
        .style(
        "height", 8 + "px")
        // d =>
        //     (d.start >= d.end
        //     ? 0
        //     : yScaleT(d.end) - yScale(d.start)) +
        //     2 +
        //     "px"
        // )
        .html(
            d => `<div class='timeline_date'>${d.start_year}</div>
                <div class='timeline_loc'>${d.location}</div>
            `
        
        );