    var xScaleA = d3.scaleBand()
        .domain(wardrobe.map(function(d) { return d.Category; }))
        .range([widthA-marginA.right-300, 200])
        .padding(1);
    
    var yScaleA = d3.scaleLinear()
        .domain([0, maxItems])
        .range([heightA-marginA.bottom-10, marginA.top]);

    var xAxisGeneratorA = d3.axisBottom(xScaleA)
        .tickSize(-14)
        .ticks(60);
    
    var xAxisA = svgA.append("g")
        .attr("class","xaxis")
        .attr("transform", `translate(5,${heightA-marginA.bottom + 15})`)
        .call(xAxisGeneratorA);
    
    xAxisA.selectAll(".tick text")
        .attr("class", "topLabels")
        .attr("transform", function(d){ return( "translate(0,-20)rotate(30)")})
        .style("text-anchor", "start");

    var topsA = svgA.append("g").attr("class", "topsA")

    topsA.selectAll("rect").data(tops)
        .enter()
        .append("rect")
        .attr("x", function() {
            return xScaleA("Tops")
        })
        .attr("y", function(d) { return yScaleA(d.ypos); })
        .attr("width", 70)
        .attr("height", 12)
        .attr("fill", function(d) { return d.Primary_Color; })
        .attr("stroke", "none")
        .attr("rx", 2)								
        .attr("ry", 2);

    var bottomsA = svgA.append("g").attr("class", "bottomsA")

    bottomsA.selectAll("rect").data(bottoms)
        .enter()
        .append("rect")
        .attr("x", function() {
            return xScaleA("Bottoms")
        })
        .attr("y", function(d) { return yScaleA(d.ypos); })
        .attr("width", 70)
        .attr("height", 12)
        .attr("fill", function(d) { return d.Primary_Color; })
        .attr("rx", 2)								
        .attr("ry", 2);

    var dressesA = svgA.append("g").attr("class", "dressesA")

    dressesA.selectAll("rect").data(dresses)
        .enter()
        .append("rect")
        .attr("x", function() {
            return xScaleA("Dresses & Jumpsuits")
        })
        .attr("y", function(d) { return yScaleA(d.ypos); })
        .attr("width", 70)
        .attr("height", 12)
        .attr("fill", function(d) { return d.Primary_Color; })
        .attr("rx", 2)								
        .attr("ry", 2);

    var setsA = svgA.append("g").attr("class", "setsA")

    setsA.selectAll("rect").data(sets)
        .enter()
        .append("rect")
        .attr("x", function() {
            return xScaleA("Sets")
        })
        .attr("y", function(d) { return yScaleA(d.ypos); })
        .attr("width", 70)
        .attr("height", 12)
        .attr("fill", function(d) { return d.Primary_Color; })
        .attr("rx", 2)								
        .attr("ry", 2);

    var outerwearA = svgA.append("g").attr("class", "outerwearA")

    outerwearA.selectAll("rect").data(outerwear)
        .enter()
        .append("rect")
        .attr("x", function() {
            return xScaleA("Outwear")
        })
        .attr("y", function(d) { return yScaleA(d.ypos); })
        .attr("width", 70)
        .attr("height", 12)
        .attr("fill", function(d) { return d.Primary_Color; })
        .attr("rx", 2)								
        .attr("ry", 2);

    const markerBoxWidth = 8;
    const markerBoxHeight = 8;
    const refX = markerBoxWidth / 2;
    const refY = markerBoxHeight / 2;
    const markerWidth = markerBoxWidth / 2;
    const markerHeight = markerBoxHeight / 2;
    const arrowPoints = [[0, 0], [0, 8], [8, 4]];

    svgA.append("svg:defs").append("svg:marker")
        .attr("id", "triangle")
        .attr('viewBox', [0, 0, markerBoxWidth, markerBoxHeight])
        .attr('refX', refX)
        .attr('refY', refY)
        .attr('markerWidth', markerBoxWidth)
        .attr('markerHeight', markerBoxHeight)
        .attr("orient", "auto-start-reverse")
        .append("path")
        .attr("d", d3.line()(arrowPoints))
        .style("fill", "#a08875");

    svgA.append("line")
        .attr("x1", widthA-marginA.right-300)
        .attr("x2", widthA-marginA.right-300)
        .attr("y1", marginA.top)
        .attr("y2", 200)
        .attr("stroke", "#a08875")
        .attr("marker-start", "url(#triangle)");

    svgA.append("line")
        .attr("x1", widthA-marginA.right-300)
        .attr("x2", widthA-marginA.right-300)
        .attr("y1", 600)
        .attr("y2", heightA-marginA.bottom-10)
        .attr("stroke", "#a08875")
        .attr("marker-end", "url(#triangle)");

    svgA.append("text")
        .attr("x", 0)
        .attr("y", 4)
        .attr("transform", function(d){ return( "translate(" + (+widthA-marginA.right-300) + "," + (260) + ")rotate(-90)")})
        .attr("fill", "#3d332a")
        .text("Newer")

    svgA.append("text")
        .attr("x", 0)
        .attr("y", 4)
        .attr("transform", function(d){ return( "translate(" + (+widthA-marginA.right-300) + "," + (580) + ")rotate(-90)")})
        .attr("fill", "#3d332a")
        .text("Older")


//ORIGINAL DEFAULT FUNCTION
//     var analysisM = {top: 30, right: 20, bottom: 20, left: 0};
    // var analysisW = 225 - analysisM.left - analysisM.right;
    // var analysisH = 400 - analysisM.top - analysisM.bottom;
    
    
    // var yScaleA = d3.scaleBand()
    //     .domain(wardrobe.map(function(d) { return d.vintage_y; }))
    //     .range([analysisH-analysisM.bottom-10, analysisM.top])
    //     .padding(1);

    // var analysis = d3.select("#vis")
    //     .selectAll(".smallMults")
    //     .data(nested)
    //     .enter()
    //     .append("svg")
    //         .attr("width", analysisW +analysisM.left + analysisM.right)
    //         .attr("height", analysisH + analysisM.top + analysisM.bottom)
    //         .attr("class", "smallMults")
    //     .append("g")
    //         .attr("transform",
    //             "translate(" + analysisM.left + "," + analysisM.top + ")");

    // analysis.selectAll(".bar")
    //     .data(function(d) {return d.values;})
    //     .enter()
    //     .append("rect")
    //     .attr("class", "bar")
    //     .attr("x", function(d) {
    //         if(vintageItems.indexOf(d.Description)>=0) {
    //             return smallMargin.left;
    //         } else {
    //             return 80;
    //         }
    //     })
    //     .attr("width", 70)
    //     .attr("y", function(d) { return yScaleA(d.vintage_y); })
    //     .attr("height", 12)
    //     .attr("fill", function(d) {
    //         if(d.Pattern === "N") {
    //             return d.Primary_Color;
    //         } else {
    //             return patterns[d.Pattern_ID];
    //         } 
    //         })
    //     .attr("rx", 2)								
    //     .attr("ry", 2).on("mouseover, mousemove", function(d) {

    //         analysistooltip.classed("hidden", false)
    //         analysistooltip.select(".brand")
    //             .html(function() {
    //                 if(d.Vintage === "N") {
    //                     return d.Brand;
    //                 } else {
    //                     return "Vintage";
    //                 } 
    //             }) 
    //         analysistooltip.select(".item")
    //             .html(function() {
    //                 return d.Description  + " " + d.Sub_Category;
    //             })
    //         var string;

    //         if(d.Category === "Bottoms") {
    //             string = `<img src=${bottompics[d.ypos-1]} class="bottoms"/>`
    //         } else if(d.Category === "Dresses & Jumpsuits") {
    //             string = `<img src=${dresspics[d.ypos-1]} class="dresses"/>`
    //         } else if(d.Category === "Tops") {
    //             string = `<img src=${toppics[d.ypos-1]} class="tops"/>`
    //         } else if(d.Category === "Outwear") {
    //             string = `<img src=${outerpics[d.ypos-1]} class="outerwear"/>`
    //         } else if(d.Category === "Sets") {
    //             string = `<img src=${setpics[d.ypos-1]} class="sets"/>`
    //         }
    //         analysistooltip.select(".annotation_image").html(string);
    //       }).on("mouseout", function() {
    //         analysistooltip.classed("hidden", true);
    //       });

    //     analysis.append("text")
    //         .attr('class','smalllabel')
    //         .attr('x', analysisM.left)
    //         .attr('y', analysisH + 10)
    //         .style("font-size", "12pt")
    //         .style("font-weight", "bold")
    //         .text( function(d) { return d.key; })

    //     analysis.append("text")
    //         .attr('class','smalllabel')
    //         .attr('x', analysisM.left)
    //         .attr('y', analysisH - 15)
    //         .style("font-size", "10pt")
    //         .text("Vintage")

    //     analysis.append("text")
    //         .attr('class','smalllabel')
    //         .attr('x', 80)
    //         .attr('y', analysisH - 15)
    //         .style("font-size", "10pt")
    //         .text("New")