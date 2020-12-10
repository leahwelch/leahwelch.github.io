function show_china() {
    canvas_clear();
    supp_clear();
    console.log("show china graph");
    d3.xml("./image/china_layers.svg", function(error, china_xml) {

        d3.select("#country_name").html("The Language of Obesity in China");
        d3.select("#explanation").html("Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse ")
        console.log(china);
        var theme_totals = [];
        for(var i = 0; i < china.length; i++) {
            var totalA = china[i].theme_total;
            if(totalA > 1) {
                theme_totals.push({category: china[i].category, theme: china[i].sub_category, value:+totalA})
            }
        }
        console.log(theme_totals);

        var totals = {
            min: d3.min(theme_totals, function(d) {return +d.value}),
            max: d3.max(theme_totals, function(d) {return +d.value})
        }
        console.log(totals);

        var xScale = d3.scaleLinear()
            .domain([totals.min, totals.max])
            .range([suppMargin.left, suppWidth-suppMargin.right-suppMargin.left])
        
        var yAxisGenerator = d3.axisRight(yScale)
            .tickSize(-14)
            .ticks(60);
        
        var yAxis = supplement.append("g")
            .attr("class","axis")
            .attr("transform", `translate(${suppMargin.left},7)`)
            .call(yAxisGenerator);

        var bar = supplement.selectAll("rect")
            .data(theme_totals)
            .enter()
            .append("rect")
                .attr("x", suppMargin.left)
                .attr("y", function(d) {return yScale(d.theme)})
                .attr("width", function(d) {return xScale(d.value)})
                .attr("height", 15)
                .attr("fill", function(d) { return colorScale(d.theme); });
        
        yAxis.selectAll(".tick text")
            .attr("class", "sideLabels")
            .attr("transform", function(d){ return( "translate(-10,0)")})
            .style("text-anchor", "end");
        
        var quants = supplement.selectAll(".quantLabels")
            .data(theme_totals)
            .enter()
            .append("text")
                .attr("x", function(d) {return suppMargin.left + xScale(d.value) + 5})
                .attr("y", function(d) {return yScale(d.theme) + 12})
                .attr("class", "quantLabels")
                .style("text-anchor", "start")
                .text(function(d){return d.value});
        
        var suppTitle = supplement.append("text")
            .attr("x", suppMargin.left)
            .attr("y", suppMargin.top)
            .attr("class", "suppTitle")
            .text("Themes")

        htmlSVG.appendChild(china_xml.documentElement.getElementById('grotesque'));

        //     // d3 objects for later use
        svg = d3.select(htmlSVG);
        grotesque = svg.select('#grotesque');

        var xmlSVG = d3.select(china_xml.getElementsByTagName('svg')[0]);
        //     // copy its "viewBox" attribute to the svg element in our HTML file
        svg.attr('viewBox', xmlSVG.attr('viewBox'));

        grotesque.style("fill", "none");
        grotesque.selectAll("path").style("stroke-width", .75)
        grotesque.selectAll("#america_mouse_1, #america_mouse_2, #food_mouse, #children_mouse_1, #children_mouse_2, #problems_mouse_1, #problems_mouse_2, #disease_mouse_1, #disease_mouse_2, #obesity_mouse, #education_mouse, #science_mouse, #lifestyle_mouse, #medicine_mouse")
            .style("fill", "none").style("stroke", "none")
            .style("pointer-events", "all")
            .on("mouseenter", function(d) {
                grotesque.selectAll("." + this.getAttribute('class')).style("stroke-width", 2)
                // tooltip.classed("hidden", false)
                //     .style("top", d3.event.pageY  - 700 + "px")
                //     .style("left", d3.event.pageX - 150 + "px")
                // tooltip.select(".theme").html(this.getAttribute('class'))
                // for(var i = 0; i < china.length; i++) {
                //     if(this.getAttribute('class') === china[i].sub_category) {
                //         document.getElementById("words").innerHTML += china[i].word + " : " + china[i].value +  "<br>";
                //     }
                // }
            }).on("mouseout", function() {
                grotesque.selectAll("." + this.getAttribute('class')).style("stroke-width", .75)
                // document.getElementById("words").innerHTML = "";
                // tooltip.classed("hidden", true);
                
            });

        //     //Styling lines
        grotesque.select("#food_solid").style("stroke", "#61544a");
        grotesque.select("#food_dotted").style("stroke", "#61544a").attr("stroke-dasharray", 2);
        grotesque.select("#america").style("stroke", "#578e8a");
        grotesque.select("#children").style("stroke", "#9c8ca8");
        grotesque.select("#problems").style("stroke", "#4d6b40");
        grotesque.select("#disease_solid").style("stroke", "#c1771e");
        grotesque.select("#disease_dotted").style("stroke", "#c1771e").attr("stroke-dasharray", 2);
        grotesque.select("#obesity_solid").style("stroke", "#a94044");
        grotesque.select("#obesity_dotted").style("stroke", "#a94044").attr("stroke-dasharray", 2);
        grotesque.select("#education").style("stroke", "#9c8ca8");
        grotesque.select("#science").style("stroke", "#29415e");
        grotesque.select("#medicine_solid").style("stroke", "#c1771e");
        grotesque.select("#medicine_dotted").style("stroke", "#c1771e").attr("stroke-dasharray", 2);
        grotesque.select("#lifestyle_solid").style("stroke", "#61544a");
        grotesque.select("#lifestyle_dotted").style("stroke", "#61544a").attr("stroke-dasharray", 2);
    });
}