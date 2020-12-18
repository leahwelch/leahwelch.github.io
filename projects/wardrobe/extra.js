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