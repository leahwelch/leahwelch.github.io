var svg = null;
var grotesque = null;


d3.queue()
    .defer(d3.csv, "./data/China_Obesity.csv")
    .defer(d3.csv, "./data/Kuwait_Obesity.csv")
    .defer(d3.csv, "./data/Mexico_Obesity.csv")
    .defer(d3.csv, "./data/Tonga_Obesity.csv")
    .await(function(error, china, kuwait, mexico, tonga) {

    var annotation = d3.select(".annotation");

    

    d3.xml("./image/kuwait_layers.svg", function(error, xml) {
        console.log(kuwait);
        
        var htmlSVG = document.getElementById('graph');  // the svg-element in our HTML file
        // append the "maproot" group to the svg-element in our HTML file
        htmlSVG.appendChild(xml.documentElement.getElementById('grotesque'));

        // d3 objects for later use
        svg = d3.select(htmlSVG);
        grotesque = svg.select('#grotesque');

        var xmlSVG = d3.select(xml.getElementsByTagName('svg')[0]);
        // copy its "viewBox" attribute to the svg element in our HTML file
        svg.attr('viewBox', xmlSVG.attr('viewBox'));

        grotesque.style("fill", "none");
        grotesque.selectAll("path").style("stroke-width", .75).on("mouseenter", function() {
            grotesque.selectAll("." + this.getAttribute('class')).style("stroke-width", 2)
            annotation.select(".theme").html("Theme: " + this.getAttribute('class'))
            for(var i = 0; i < kuwait.length; i++) {
                if(this.getAttribute('class') === kuwait[i].sub_category) {
                    document.getElementById("words").innerHTML += kuwait[i].word + " : " + kuwait[i].value +  "<br>";
                }
            }
            //console.log("im over a group");


        }).on("mouseout", function() {
            grotesque.selectAll("." + this.getAttribute('class')).style("stroke-width", .75)
            document.getElementById("words").innerHTML = "";
            annotation.select(".theme").html("")
            
            

        });

        //Styling lines
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
});