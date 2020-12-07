var svg = null;
var grotesque = null;
var width = d3.select('#vis').node().offsetWidth;
var height =  d3.select('#vis').node().offsetHeight;

var suppWidth = 400;
var suppHeight = 500;
var suppMargin = {left: 80, top: 20, right: 50, bottom: 20};

var supplement = d3.select("#supplement")
        .append("svg")
        .attr("width", suppWidth)
        .attr("height", suppHeight);

var kuwait_button = d3.select("#kuwait_button");
var china_button = d3.select("#china_button");
var mexico_button = d3.select("#mexico_button");
var tonga_button = d3.select("#tonga_button");

//Default Supplement
var themes = ["food", "america", "obesity", "disease", "problems", "children", "medicine", "lifestyle", "science", "education"];
var themesTonga = ["food", "america", "obesity", "disease", "problems", "children", "lifestyle", "science", "education"];

var yScale = d3.scaleBand()
    .domain(themes)
    .range([suppMargin.top, suppHeight-suppMargin.bottom])
    .padding(1);

var yScaleTonga = d3.scaleBand()
    .domain(themesTonga)
    .range([suppMargin.top, suppHeight-suppMargin.bottom])
    .padding(1);

var colorScale = d3.scaleOrdinal()
    .domain(themes)
    .range(["#61544a", "#578e8a", "#a94044", "#c1771e", "#4d6b40", "#9c8ca8", "#c1771e", "#61544a", "#29415e", "#9c8ca8"]);

var colorScaleTonga = d3.scaleOrdinal()
    .domain(themesTonga)
    .range(["#61544a", "#578e8a", "#a94044", "#c1771e", "#4d6b40", "#9c8ca8", "#61544a", "#29415e", "#9c8ca8"]);

//Load Data
    
d3.queue()
    .defer(d3.csv, "./data/China_Obesity.csv")
    .defer(d3.csv, "./data/Kuwait_Obesity.csv")
    .defer(d3.csv, "./data/Mexico_Obesity.csv")
    .defer(d3.csv, "./data/Tonga_Obesity.csv")
    .await(function(error, china, kuwait, mexico, tonga) {

    var annotation = d3.select(".annotation");
    var htmlSVG = document.getElementById('graph');
    
    function canvas_clear() {
        
        d3.selectAll("#graph")
            .selectAll("*")
            .remove();
    }

    function supp_clear() {
        
        supplement
            .selectAll("*")
            .remove();
    }

    function show_kuwait() {
        canvas_clear();
        supp_clear();
        console.log("show kuwait");
        d3.xml("./image/kuwait_layers.svg", function(error, kuwait_xml) {

            d3.select("#country_name").html("The Language of Obesity in Kuwait");
            d3.select("#explanation").html("Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse ")

            
            console.log(kuwait);

            var theme_totals = [];
            for(var i = 0; i < kuwait.length; i++) {
                var totalA = kuwait[i].theme_total;
                if(totalA > 1) {
                    theme_totals.push({category: kuwait[i].category, theme: kuwait[i].sub_category, value:+totalA})
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

            htmlSVG.appendChild(kuwait_xml.documentElement.getElementById('grotesque'));
    
            //     // d3 objects for later use
            svg = d3.select(htmlSVG);
            grotesque = svg.select('#grotesque');
    
            var xmlSVG = d3.select(kuwait_xml.getElementsByTagName('svg')[0]);
            //     // copy its "viewBox" attribute to the svg element in our HTML file
            svg.attr('viewBox', xmlSVG.attr('viewBox'));
    
            grotesque.style("fill", "none");
            grotesque.selectAll("path").style("stroke-width", .75)
            grotesque.selectAll("#america_mouse, #food_mouse, #children_mouse, #problems_mouse, #disease_mouse, #obesity_mouse, #education_mouse, #science_mouse, #lifestyle_mouse, #medicine_mouse")
                .style("fill", "none").style("stroke", "none")
                .style("pointer-events", "all")
                .on("mouseenter", function(d) {
                    grotesque.selectAll("." + this.getAttribute('class')).style("stroke-width", 2)
                    // tooltip.classed("hidden", false)
                    //     .style("top", d3.event.pageY  - 100 + "px")
                    //     .style("left", d3.event.pageX - 100 + "px")
                    // tooltip.select(".theme").html(this.getAttribute('class'))
                    // for(var i = 0; i < kuwait.length; i++) {
                    //     if(this.getAttribute('class') === kuwait[i].sub_category) {
                    //         document.getElementById("words").innerHTML += kuwait[i].word + " : " + kuwait[i].value +  "<br>";
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
            grotesque.select("#america_solid").style("stroke", "#578e8a");
            grotesque.select("#america_dotted").style("stroke", "#578e8a").attr("stroke-dasharray", 2);
            grotesque.select("#children").style("stroke", "#9c8ca8");
            grotesque.select("#problems_solid").style("stroke", "#4d6b40");
            grotesque.select("#problems_dotted").style("stroke", "#4d6b40").attr("stroke-dasharray", 2);
            grotesque.select("#disease_solid").style("stroke", "#c1771e");
            grotesque.select("#disease_dotted").style("stroke", "#c1771e").attr("stroke-dasharray", 2);
            grotesque.select("#obesity_solid").style("stroke", "#a94044");
            grotesque.select("#obesity_dotted").style("stroke", "#a94044").attr("stroke-dasharray", 2);
            grotesque.select("#education").style("stroke", "#9c8ca8");
            grotesque.select("#science").style("stroke", "#29415e");
            grotesque.select("#medicine").style("stroke", "#c1771e");
            grotesque.select("#lifestyle_solid").style("stroke", "#61544a");
            grotesque.select("#lifestyle_dotted").style("stroke", "#61544a").attr("stroke-dasharray", 2);
        });
    }

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

    function show_mexico() {
        canvas_clear();
        supp_clear();
        d3.xml("./image/mexico_layers.svg", function(error, mexico_xml) {
            d3.select("#country_name").html("The Language of Obesity in Mexico");
            d3.select("#explanation").html("Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse ")
            
            var theme_totals = [];
            for(var i = 0; i < mexico.length; i++) {
                var totalA = mexico[i].theme_total;
                if(totalA > 1) {
                    theme_totals.push({category: mexico[i].category, theme: mexico[i].sub_category, value:+totalA})
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
            
            htmlSVG.appendChild(mexico_xml.documentElement.getElementById('grotesque'));
    
            //     // d3 objects for later use
            svg = d3.select(htmlSVG);
            grotesque = svg.select('#grotesque');
    
            var xmlSVG = d3.select(mexico_xml.getElementsByTagName('svg')[0]);
            //     // copy its "viewBox" attribute to the svg element in our HTML file
            svg.attr('viewBox', xmlSVG.attr('viewBox'));
    
            grotesque.style("fill", "none");
            grotesque.selectAll("path").style("stroke-width", .75)
            grotesque.selectAll("#america_mouse_1, #america_mouse_2, #food_mouse, #children_mouse, #problems_mouse, #disease_mouse, #obesity_mouse, #education_mouse, #science_mouse, #lifestyle_mouse, #medicine_mouse")
                .style("fill", "none").style("stroke", "none")
                .style("pointer-events", "all")
                .on("mouseenter", function(d) {
                    grotesque.selectAll("." + this.getAttribute('class')).style("stroke-width", 2)
                    // tooltip.classed("hidden", false)
                    //     .style("top", d3.event.pageY  - 1500 + "px")
                    //     .style("left", d3.event.pageX - 150 + "px")
                    // tooltip.select(".theme").html(this.getAttribute('class'))
                    // for(var i = 0; i < mexico.length; i++) {
                    //     if(this.getAttribute('class') === mexico[i].sub_category) {
                    //         document.getElementById("words").innerHTML += mexico[i].word + " : " + mexico[i].value +  "<br>";
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
            grotesque.select("#america_solid").style("stroke", "#578e8a");
            grotesque.select("#america_dotted").style("stroke", "#578e8a").attr("stroke-dasharray", 2);
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
            grotesque.select("#lifestyle").style("stroke", "#61544a");
        });
    }

    function show_tonga() {
        canvas_clear();
        supp_clear();
        console.log("show tonga graph");
        d3.xml("./image/tonga_layers.svg", function(error, tonga_xml) {
            d3.select("#country_name").html("The Language of Obesity in Tonga");
            d3.select("#explanation").html("Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse ")
            
            var theme_totals = [];
            for(var i = 0; i < tonga.length; i++) {
                var totalA = tonga[i].theme_total;
                if(totalA > 1) {
                    theme_totals.push({category: tonga[i].category, theme: tonga[i].sub_category, value:+totalA})
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
            
            var yAxisGenerator = d3.axisRight(yScaleTonga)
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
                    .attr("y", function(d) {return yScaleTonga(d.theme)})
                    .attr("width", function(d) {return xScale(d.value)})
                    .attr("height", 15)
                    .attr("fill", function(d) { return colorScaleTonga(d.theme); });
            
            yAxis.selectAll(".tick text")
                .attr("class", "sideLabels")
                .attr("transform", function(d){ return( "translate(-10,0)")})
                .style("text-anchor", "end");
            
            var quants = supplement.selectAll(".quantLabels")
                .data(theme_totals)
                .enter()
                .append("text")
                    .attr("x", function(d) {return suppMargin.left + xScale(d.value) + 5})
                    .attr("y", function(d) {return yScaleTonga(d.theme) + 12})
                    .attr("class", "quantLabels")
                    .style("text-anchor", "start")
                    .text(function(d){return d.value});
            
            var suppTitle = supplement.append("text")
                .attr("x", suppMargin.left)
                .attr("y", suppMargin.top)
                .attr("class", "suppTitle")
                .text("Themes")
            
            htmlSVG.appendChild(tonga_xml.documentElement.getElementById('grotesque'));
    
            //     // d3 objects for later use
            svg = d3.select(htmlSVG);
            grotesque = svg.select('#grotesque');
    
            var xmlSVG = d3.select(tonga_xml.getElementsByTagName('svg')[0]);
            //     // copy its "viewBox" attribute to the svg element in our HTML file
            svg.attr('viewBox', xmlSVG.attr('viewBox'));
    
            grotesque.style("fill", "none");
            grotesque.selectAll("path").style("stroke-width", .75)
            grotesque.selectAll("#america_mouse, #food_mouse, #children_mouse, #problems_mouse, #disease_mouse, #obesity_mouse, #education_mouse, #science_mouse, #lifestyle_mouse, #medicine_mouse")
                .style("fill", "none").style("stroke", "none")
                .style("pointer-events", "all")
                .on("mouseenter", function(d) {
                    grotesque.selectAll("." + this.getAttribute('class')).style("stroke-width", 2)
                    // tooltip.classed("hidden", false)
                    //     .style("top", d3.event.pageY  - 2500 + "px")
                    //     .style("left", d3.event.pageX - 100 + "px")
                    // tooltip.select(".theme").html(this.getAttribute('class'))
                    // for(var i = 0; i < tonga.length; i++) {
                    //     if(this.getAttribute('class') ===tonga[i].sub_category) {
                    //         document.getElementById("words").innerHTML += "<b>" + tonga[i].word + " : " + "</b>" + tonga[i].value +  "<br>";
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

    show_kuwait();

    china_button.on("click", show_china);
    kuwait_button.on("click", show_kuwait);
    mexico_button.on("click", show_mexico);
    tonga_button.on("click", show_tonga);



    
    });