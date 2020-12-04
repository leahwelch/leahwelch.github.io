var svg = null;
var grotesque = null;
var width = d3.select('#vis').node().offsetWidth;
var height =  d3.select('#vis').node().offsetHeight;

var tooltip = d3.select("#tooltip");



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

    
    function sec_1() {
        canvas_clear();
        console.log("show kuwait");
        d3.xml("./image/kuwait_layers.svg", function(error, kuwait_xml) {

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
                tooltip.classed("hidden", false)
                    .style("top", d3.event.pageY  - 100 + "px")
                    .style("left", d3.event.pageX - 100 + "px")
                tooltip.select(".theme").html("Theme: " + this.getAttribute('class'))
                for(var i = 0; i < kuwait.length; i++) {
                    if(this.getAttribute('class') === kuwait[i].sub_category) {
                        document.getElementById("words").innerHTML += kuwait[i].word + " : " + kuwait[i].value +  "<br>";
                    }
                }
            }).on("mouseout", function() {
                grotesque.selectAll("." + this.getAttribute('class')).style("stroke-width", .75)
                document.getElementById("words").innerHTML = "";
                tooltip.classed("hidden", true);
                
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
    function sec_2() {
        canvas_clear();
        console.log("show china graph");
        d3.xml("./image/china_layers.svg", function(error, china_xml) {
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
                    tooltip.classed("hidden", false)
                        .style("top", d3.event.pageY  - 700 + "px")
                        .style("left", d3.event.pageX - 150 + "px")
                    tooltip.select(".theme").html("Theme: " + this.getAttribute('class'))
                    for(var i = 0; i < kuwait.length; i++) {
                        if(this.getAttribute('class') === kuwait[i].sub_category) {
                            document.getElementById("words").innerHTML += kuwait[i].word + " : " + kuwait[i].value +  "<br>";
                        }
                    }
                }).on("mouseout", function() {
                    grotesque.selectAll("." + this.getAttribute('class')).style("stroke-width", .75)
                    document.getElementById("words").innerHTML = "";
                    tooltip.classed("hidden", true);
                    
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
    function sec_3() {
        canvas_clear();
        console.log("show mexico graph");
        d3.xml("./image/mexico_layers.svg", function(error, mexico_xml) {
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
                    tooltip.classed("hidden", false)
                        .style("top", d3.event.pageY  - 1500 + "px")
                        .style("left", d3.event.pageX - 150 + "px")
                    tooltip.select(".theme").html("Theme: " + this.getAttribute('class'))
                    for(var i = 0; i < kuwait.length; i++) {
                        if(this.getAttribute('class') === kuwait[i].sub_category) {
                            document.getElementById("words").innerHTML += kuwait[i].word + " : " + kuwait[i].value +  "<br>";
                        }
                    }
                }).on("mouseout", function() {
                    grotesque.selectAll("." + this.getAttribute('class')).style("stroke-width", .75)
                    document.getElementById("words").innerHTML = "";
                    tooltip.classed("hidden", true);
                    
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
    function sec_4() {
        canvas_clear();
        console.log("show tonga graph");
        d3.xml("./image/tonga_layers.svg", function(error, tonga_xml) {
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
                    tooltip.classed("hidden", false)
                        .style("top", d3.event.pageY  - 2500 + "px")
                        .style("left", d3.event.pageX - 100 + "px")
                    tooltip.select(".theme").html(this.getAttribute('class'))
                    for(var i = 0; i < kuwait.length; i++) {
                        if(this.getAttribute('class') === kuwait[i].sub_category) {
                            document.getElementById("words").innerHTML += kuwait[i].word + " : " + kuwait[i].value +  "<br>";
                        }
                    }
                }).on("mouseout", function() {
                    grotesque.selectAll("." + this.getAttribute('class')).style("stroke-width", .75)
                    document.getElementById("words").innerHTML = "";
                    tooltip.classed("hidden", true);
                    
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

    var gs = d3.graphScroll()
        .container(d3.select('#container'))
        .graph(d3.selectAll('#vis'))
        .sections(d3.selectAll('#sections > div'))
        .offset(height)
        .eventId('uniqueId1')
        .on('active', function(i) {



        [
            sec_1,
            sec_2,
            sec_3,
            sec_4
        ][i]();

    });
});
    