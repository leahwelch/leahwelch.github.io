var width = d3.select('#graph').node().offsetWidth;
var height =  d3.select('#graph').node().offsetHeight;

// height = 500;
var margin = {
  top: 20,
  right: 20,
  bottom: 50,
  left: 100
};

var svg = d3.select("#graph")
  .append('svg')
  .attr("width", width)
  .attr("height", height);


  console.log("hello!");
  d3.queue()
    .defer(d3.json, "data/nodes.json")
    .defer(d3.json, "data/links.json")
    .await(function(error, nodes, links) {

        console.log(nodes);

    
    function canvas_clear() {
    
        svg
            .selectAll("*")
            .remove();
        }


    function sec_1() {
        canvas_clear();
        console.log("first graph!");
        var simulation = d3.forceSimulation(nodes)
            .force("link", d3.forceLink(links).id(function(d) { return d.id; }).distance(30).strength(1))
            .force("charge", d3.forceManyBody().strength(-200))
            .force("center", d3.forceCenter(width/2, height/2))
            .force("collide", d3.forceCollide().radius(25));

        var link = svg.append("g")
            .selectAll("line")
            .data(links)
            .enter()
            .append("line")
                .attr("stroke", "#666666")
                .attr("stroke-width", 2);

        var node = svg.append("g")
            .selectAll("circle")
            .data(nodes)
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

        var tooltip = d3.select("#graph")
                .append("div")
                .attr("class", "tooltip");
            
            node.on("mouseover", function(d) {
                var cx = d.x + 20;
                var cy = d.y - 10;

                tooltip.style("visibility", "visible")
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
                tooltip.style("visibility", "hidden");
                node.attr("opacity",1);
                link.attr("opacity",1).attr("stroke-width", 2);
            });

    }

    function sec_2() {
        canvas_clear();
        var obesityN = nodes.filter(function(d) {
            return d.filterId === 1;
        });

        var obesityL = links.filter(function(d) {
            return d.filterId === 1;
        });

        console.log(obesityL);

        var simulation = d3.forceSimulation(obesityN)
            .force("link", d3.forceLink(obesityL).id(function(d) { return d.id; }).distance(50).strength(1))
            .force("charge", d3.forceManyBody().strength(-200))
            .force("center", d3.forceCenter(width/2, height/2))
            .force("collide", d3.forceCollide().radius(50));

        var link = svg.append("g")
            .selectAll("line")
            .data(obesityL)
            .enter()
            .append("line")
                .attr("stroke", "#666666")
                .attr("stroke-width", 2);

        var node = svg.append("g")
            .selectAll("circle")
            .data(obesityN)
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

        var tooltip = d3.select("#graph")
                .append("div")
                .attr("class", "tooltip");
            
            node.on("mouseover", function(d) {
                var cx = d.x + 20;
                var cy = d.y - 10;

                tooltip.style("visibility", "visible")
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
                tooltip.style("visibility", "hidden");
                node.attr("opacity",1);
                link.attr("opacity",1).attr("stroke-width", 2);
            });

    }


    

    var gs = d3.graphScroll()
    .container(d3.select('#container'))
    .graph(d3.selectAll('#graph'))
    .sections(d3.selectAll('#sections > div'))
    // .offset(height)
    .eventId('uniqueId1')
    .on('active', function(i) {



      [
        sec_1,
        sec_2
      ][i]();

    });
    
});

