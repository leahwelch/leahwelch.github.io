var width = document.querySelector("#graph").clientWidth;

var height =  document.querySelector("#graph").clientHeight;

// height = 500;
var margin = {
  top: 20,
  right: 20,
  bottom: 20,
  left: 20
};

var svg = d3.select("#graph")
  .append('svg')
  .attr("width", width)
  .attr("height", height);

var tooltip = d3.select("#graph")
        .append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);


  console.log("hello!");
  d3.queue()
    .defer(d3.json, "data/nodes.json")
    .defer(d3.json, "data/links.json")
    .await(function(error, nodes, links) {

        var subsidiesN = nodes.filter(function(d) {
            return d.finalId === 3;
        });

        var subsidiesL = links.filter(function(d) {
            return d.finalId === 3;
        });

        var simulation = d3.forceSimulation(subsidiesN)
            .force("link", d3.forceLink(subsidiesL).id(function(d) { return d.id; }).distance(50).strength(1))
            .force("charge", d3.forceManyBody().strength(-200))
            .force("center", d3.forceCenter(width/2, height/2))
            .force("collide", d3.forceCollide().radius(50));

        var link = svg.append("g")
            .selectAll("line")
            .data(subsidiesL)
            .enter()
            .append("line")
                .attr("stroke", "#666666")
                .attr("stroke-width", 2);

        var node = svg.append("g")
            .selectAll("circle")
            .data(subsidiesN)
            .enter()
            .append("circle")
                .attr("stroke", "#ffffff")
                .attr("stroke-width", 1)
                .attr("r", 15)
                .attr("fill", function(d) {
                    if(d.category === "Consumer Impacts") {
                        return "#93560d";
                    } else if(d.category === "Environmental Impacts") {
                        return "#487bba";
                    } else if(d.category === "Food Industry") {
                        return "#d93e4a";
                    } else if(d.category === "Smallholder Impacts") {
                        return "#046e66";
                    } else if(d.category === "Policy Examples") {
                        return "#3f007d";
                    } 
                });

        simulation.on("tick", function() {

            link.attr("x1", function(d) { return d.source.x; })
                .attr("y1", function(d) { return d.source.y; })
                .attr("x2", function(d) { return d.target.x; })
                .attr("y2", function(d) { return d.target.y; });
            
            node.attr("cx", function(d) { return d.x; })
                .attr("cy", function(d) { return d.y; });

        });
            
            node.on("mouseover, mousemove", function(d) {
                var cx = d.x + 20;
                var cy = d.y - 10;

                tooltip.style("opacity", 1)
                    .style("left", cx  + "px")
                    .style("top", cy  + "px")
                    .text(d.id);

                node.attr("opacity",0.2);
                link.attr("opacity",0.2);

                d3.select(this).attr("opacity",1);

                var connected = link.filter(function(e) {
                    return e.source.id === d.id || e.target.id === d.id;
                });
                connected.attr("opacity",1).attr("stroke-width", 4);
                connected.each(function(e) {
                    node.filter(function(f) {
                        return f.id === e.source.id || f.id === e.target.id;
                    }).attr("opacity",1);
        });
            }).on("mouseout", function() {
                tooltip.style("opacity", 0);
                node.attr("opacity",1);
                link.attr("opacity",1).attr("stroke-width", 2);
            });

    });