var width = document.querySelector("#chart").clientWidth;
var height = document.querySelector("#chart").clientHeight;
var margin = {top: 200, left: 0, right: 70, bottom: 400};
console.log(height)

var treeWidth = document.querySelector("#tree").clientWidth;
var treeHeight = document.querySelector("#tree").clientHeight;
var treeMargin = {top: 20, left: 20, right: 0, bottom: 20};

var svg = d3.select("#chart")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

var treePanel = d3.select("#tree")
    .append("svg")
    .attr("width", treeWidth)
    .attr("height", treeHeight);

var treemap = d3.treemap()
    .size([treeWidth, treeHeight])
    .padding(0.5)
    .round(true)

let barHeight = 5;
const chartHeight = height - margin.bottom - margin.top;
const barWidth = 17;

const hueBtn = d3.select("#hueBtn")
const satBtn = d3.select("#satBtn")
const lumBtn = d3.select("#lumBtn")
const streamBtn = d3.select("#stream")
const shelvesBtn = d3.select("#shelves")
// const nrmlBtn = d3.select("#normalize")
const resetBtn = d3.select("#reset")
const dropDown = d3.select("#dropdownArea").append("select")
    .attr("name", "brandList")
    .attr("class", "custom-select");

function showVis(evt) {
    // Declare all variables
    var i, tablinks;
    
    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    
    // Show the current tab, and add an "active" class to the button that opened the tab
    evt.currentTarget.className += " active";
}

function formChange(evt) {
    // Declare all variables
    var i, tabForms;
    
    // Get all elements with class="tablinks" and remove the class "active"
    tabForms = document.getElementsByClassName("tabForms");
    for (i = 0; i < tabForms.length; i++) {
        tabForms[i].className = tabForms[i].className.replace(" active", "");
    }
    
    // Show the current tab, and add an "active" class to the button that opened the tab
    evt.currentTarget.className += " active";
}
    

d3.csv("./data/wearlog.csv", parse).then(function(data) {
    
    data.forEach(function(d) {
        if(d.brand === '') {
            d.brand = 'Vintage';
        }
    })

    const hueScale = d3.scaleLinear()
        .domain([0,360])
        .range([margin.left, width-margin.right])

    const satScale = d3.scaleLinear()
        .domain([0,100])
        .range([margin.left, width-margin.right])

    let brands = [];
    const brandNest = d3.nest()
        .key(d=>d.brand)
        .key(d=>d.id)
        .rollup()
        .entries(data)
    brandNest.forEach((d) => {
        if(d.values.length >= 2) {
            brands.push(d.key)
        }
    })
    const options = dropDown.selectAll("option")
        .data(brands)
        .enter()
        .append("option");

    options.text(function(d) {
        return d;
            })
            .attr("value", function(d) {
        return d;
        });

    let colors = [];
    for(let i = 0; i < data.length; i++) {
        colors.push({color: data[i].hex1, date: data[i].date, id: data[i].id, description: data[i].description, week: data[i].week, brand: data[i].brand, day: data[i].day})
        colors.push({color: data[i].hex2, date: data[i].date, id: data[i].id, description: data[i].description, week: data[i].week, brand: data[i].brand, day: data[i].day})
        colors.push({color: data[i].hex3, date: data[i].date, id: data[i].id, description: data[i].description, week: data[i].week, brand: data[i].brand, day: data[i].day})
        colors.push({color: data[i].hex4, date: data[i].date, id: data[i].id, description: data[i].description, week: data[i].week, brand: data[i].brand, day: data[i].day})
        colors.push({color: data[i].hex5, date: data[i].date, id: data[i].id, description: data[i].description, week: data[i].week, brand: data[i].brand, day: data[i].day})
    }

    colors.forEach((d) => {
        d.hsl = HEXtoHSL(d.color)
        d.hue = d.hsl.h
        d.sat = d.hsl.s
        d.lum = d.hsl.l
    })

    colors.sort((a,b) => d3.ascending(a.date,b.date))

    let histogramValues = d3.histogram()
        .value(function(d) {return d.hue})
        .domain(hueScale.domain())
        .thresholds(hueScale.ticks(20))

    let bins = histogramValues(colors)

    colors.forEach((g) => {
        bins.forEach((bin) => {
            bin.forEach((d,i) => {
                d.bucket = bin.x0;
            })
            if(bin.date === g.date) {
                g.bucket = bin.x0;
            }
        })
    })

    let nested = d3.nest()
        .key(d=>d.week)
        .rollup()
        .entries(colors)

    nested.forEach((d) => {
        let stackHeight = d.values.length * barHeight;
        d.offset = stackHeight/3;
        d.key = +d.key
        d.values.sort((a,b)=>d3.ascending(b.hue,a.hue))
        d.values.forEach((p,i)=>{
            p.ypos = i;
        })
    })

    console.log(nested)

    let colorNest = d3.nest()
        .key(d=>d.bucket)
        .key(d=>d.hue)
        .key(d=>d.color)
        .rollup(function(v) { return v.length;})
        .entries(colors)

    colorNest.forEach((d) => {
        d.key = +d.key;
        d.values.forEach((p) => {
            p.key = +p.key;
        })
        d.values.sort((a,b)=>d3.ascending(a.key,b.key))
    })

    colorNest.sort((a,b)=>d3.ascending(a.key,b.key))

    console.log(colorNest)

    let hierarchy = d3.hierarchy({values: colorNest}, function(d) { return d.values; })
        .sum(function(d) { return d.value; });

    let root = treemap(hierarchy);

    const xScale = d3.scaleLinear()
        .domain([1,74])
        .range([margin.left, width-margin.right])

    const dateScale = d3.scaleTime()
        .domain([data[0].date, data[data.length-1].date])
        .range([margin.left, width-margin.right])

    let xAxis = svg.append("g")
        .attr("class", "axis")
        .attr("transform", `translate(0,${height - 50})`)
        .style("opacity", 1)
        .call(d3.axisBottom().scale(dateScale))

    let yScale = d3.scaleLinear()
        .domain([0, 60])
        .range([height-margin.bottom, margin.top])

    const grouping = svg.selectAll(".stackGroup")
        .data(nested)
        .enter()
        .append("g")
        .attr("transform", (d) => `translate(${xScale(d.key)},${d.offset})`)

    let bars = grouping.selectAll("rect").data(d=>d.values)

    let enter = bars.enter()
        .append("rect")
        .attr("width", barWidth)
        .attr("height", barHeight)
        .attr("fill", p=>p.color)
        .attr("y", function(p) { return yScale(p.ypos); })

    bars.merge(enter)
        .transition()
        .duration(500)
        .attr("width", barWidth)
        .attr("height", barHeight)
        .attr("fill", p=>p.color)
        .attr("y", function(p) { return yScale(p.ypos); })
        .attr("opacity",1)
        
    bars.exit()
        .transition()
        .duration(500)
        .attr("opacity", 0)
        .remove();

    let tree = treePanel.selectAll("rect")
        .data(root.leaves())

    console.log(root.leaves())
        
    let treeEnter = tree.enter()
        .append("rect")
        .attr("x", function(d) { return d.x0; })
        .attr("y", function(d) { return d.y0; })
        .attr("class", d => d.data.bucket)
        .attr("width", function(d) { return d.x1 - d.x0; })
        .attr("height", function(d) { return d.y1 - d.y0; })
        .attr("fill", function(d) { 
            return d.data.key;
                })
        .attr("stroke", "#efe8e6")
        .attr("opacity", 1);

    tree.merge(treeEnter)
        .transition()
        .duration(500)
        .attr("x", function(d) { return d.x0; })
        .attr("y", function(d) { return d.y0; })
        .attr("class", d => d.data.bucket)
        .attr("width", function(d) { return d.x1 - d.x0; })
        .attr("height", function(d) { return d.y1 - d.y0; })
        .attr("fill", function(d) { 
            return d.data.key;
                })
        .attr("stroke", "#efe8e6")
        .attr("opacity", 1);

    tree.exit()
        .transition()
        .duration(500)
        .attr("opacity", 0)
        .remove();

    let mouseTree = treePanel.selectAll(".mouse")
        .data(root.children)

    let mouseTreeEnter = mouseTree.enter()
        .append("rect")
        .attr("x", function(d) { return d.x0; })
        .attr("y", function(d) { return d.y0; })
        .attr("class", "mouse")
        .attr("width", function(d) { return d.x1 - d.x0; })
        .attr("height", function(d) { return d.y1 - d.y0; })
        .style("fill", "transparent")
        .attr("stroke", "none")

    mouseTree.merge(mouseTreeEnter)
        .transition()
        .duration(500)
        .attr("x", function(d) { return d.x0; })
        .attr("y", function(d) { return d.y0; })
        .attr("class", "mouse")
        .attr("width", function(d) { return d.x1 - d.x0; })
        .attr("height", function(d) { return d.y1 - d.y0; })
        .style("fill", "transparent")
        .attr("stroke", "none")   

    mouseTree.exit()
        .transition()
        .duration(500)
        .remove();

    d3.selectAll(".mouse")
        .on('click', function(p) {
            let filteredColors = colors.filter(d=>d.bucket === p.data.key)
            let colorList = [];
            filteredColors.forEach(d=>
                    colorList.push(d.color)
                )
            tree = treePanel.selectAll("rect")
                .transition().duration(500)
                .attr("opacity", (d) => {
                    let color = d.data.key
                    if(colorList.indexOf(color) > 0) {
                        return 1;
                    } else {
                        return 0.15;
                    }
                })

            nested.forEach((d) => {
                d.filtered = d.values.filter(g=>g.bucket === p.data.key)
                let stackHeight = d.filtered.length * barHeight;
                d.offset = stackHeight/2;
                d.filtered.forEach((g,i)=>{
                    g.ypos = i;
                })
            })
    
            grouping.transition().duration(500)
                .attr("transform", (d) => `translate(${xScale(d.key)},${d.offset})`)
            
            bars = grouping.selectAll("rect").data(d=>d.filtered)
            enter = bars.enter()
                .append("rect")
                .attr("width", barWidth)
                .attr("height", barHeight)
                .attr("fill", g=>g.color)
                .attr("y", function(g) { return yScale(g.ypos); })
                .attr("opacity", 0)
            bars.merge(enter).transition()
                .duration(500)
                .attr("width", barWidth)
                .attr("height", barHeight)
                .attr("fill", g=>g.color)
                .attr("y", function(g) { return yScale(g.ypos); })
                .attr("opacity", 1)
    
            bars.exit()
                .transition()
                .duration(500)
                .attr("opacity", 0)
                .remove(); 
            
        })


    satBtn.on("click", function() {
        nested.forEach((d) => {
            d.values.sort((a,b)=>d3.ascending(b.sat,a.sat))
            d.values.forEach((p,i)=>{
                p.ypos = i;
            })
        })
        grouping.selectAll("rect").transition().duration(500).attr("y", function(p) { return yScale(p.ypos); })

        histogramValues = d3.histogram()
            .value(function(d) {return d.sat})
            .domain(satScale.domain())
            .thresholds(satScale.ticks(20))

        bins = histogramValues(colors)
        
        colors.forEach((g) => {
            bins.forEach((bin) => {
                bin.forEach((d,i) => {
                    d.bucket = bin.x0;
                })
                if(bin.date === g.date) {
                    g.bucket = bin.x0;
                }
            })
        })
        
        colorNest = d3.nest()
            .key(d=>d.bucket)
            .key(d=>d.sat)
            .key(d=>d.color)
            .rollup(function(v) { return v.length;})
            .entries(colors)

        colorNest.forEach((d) => {
            d.key = +d.key;
            d.values.forEach((p) => {
                p.key = +p.key;
            })
            d.values.sort((a,b)=>d3.ascending(a.key,b.key))
        })
    
        colorNest.sort((a,b)=>d3.ascending(a.key,b.key))

        hierarchy = d3.hierarchy({values: colorNest}, function(d) { return d.values; })
            .sum(function(d) { return d.value; });
        root = treemap(hierarchy);

        tree = treePanel.selectAll("rect")
            .data(root.leaves())
            
        let treeEnter = tree.enter()
            .append("rect")
            .attr("x", function(d) { return d.x0; })
            .attr("y", function(d) { return d.y0; })
            .attr("class", d => d.data.key)
            .attr("width", function(d) { return d.x1 - d.x0; })
            .attr("height", function(d) { return d.y1 - d.y0; })
            .attr("fill", function(d) { 
                return d.data.key;
                    })
            .attr("stroke", "#efe8e6");

        tree.merge(treeEnter)
            .transition()
            .duration(500)
            .attr("x", function(d) { return d.x0; })
            .attr("y", function(d) { return d.y0; })
            .attr("class", d => d.data.key)
            .attr("width", function(d) { return d.x1 - d.x0; })
            .attr("height", function(d) { return d.y1 - d.y0; })
            .attr("fill", function(d) { 
                return d.data.key;
                    })
            .attr("stroke", "#efe8e6");

        tree.exit()
            .transition()
            .duration(500)
            .attr("opacity", 0)
            .remove();

    let mouseTree = treePanel.selectAll(".mouse")
        .data(root.children)

    let mouseTreeEnter = mouseTree.enter()
        .append("rect")
        .attr("x", function(d) { return d.x0; })
        .attr("y", function(d) { return d.y0; })
        .attr("class", "mouse")
        .attr("width", function(d) { return d.x1 - d.x0; })
        .attr("height", function(d) { return d.y1 - d.y0; })
        .style("fill", "transparent")
        .attr("stroke", "none")

    mouseTree.merge(mouseTreeEnter)
        .transition()
        .duration(500)
        .attr("x", function(d) { return d.x0; })
        .attr("y", function(d) { return d.y0; })
        .attr("class", "mouse")
        .attr("width", function(d) { return d.x1 - d.x0; })
        .attr("height", function(d) { return d.y1 - d.y0; })
        .style("fill", "transparent")
        .attr("stroke", "none")   

    mouseTree.exit()
        .transition()
        .duration(500)
        .remove();

    d3.selectAll(".mouse")
        .on('click', function(p) {
            let filteredColors = colors.filter(d=>d.bucket === p.data.key)
            let colorList = [];
            filteredColors.forEach(d=>
                    colorList.push(d.color)
                )
            tree = treePanel.selectAll("rect")
                .transition().duration(500)
                .attr("opacity", (d) => {
                    let color = d.data.key
                    if(colorList.indexOf(color) > 0) {
                        return 1;
                    } else {
                        return 0.15;
                    }
                })

            nested.forEach((d) => {
                d.filtered = d.values.filter(g=>g.bucket === p.data.key)
                let stackHeight = d.filtered.length * barHeight;
                d.offset = stackHeight/2;
                d.filtered.forEach((g,i)=>{
                    g.ypos = i;
                })
            })
    
            grouping.transition().duration(500)
                .attr("transform", (d) => `translate(${xScale(d.key)},${d.offset})`)
            
            bars = grouping.selectAll("rect").data(d=>d.filtered)
            enter = bars.enter()
                .append("rect")
                .attr("width", barWidth)
                .attr("height", barHeight)
                .attr("fill", g=>g.color)
                .attr("y", function(g) { return yScale(g.ypos); })
                .attr("opacity", 0)
            bars.merge(enter).transition()
                .duration(500)
                .attr("width", barWidth)
                .attr("height", barHeight)
                .attr("fill", g=>g.color)
                .attr("y", function(g) { return yScale(g.ypos); })
                .attr("opacity", 1)
    
            bars.exit()
                .transition()
                .duration(500)
                .attr("opacity", 0)
                .remove(); 
            
        })
        
    })

    lumBtn.on("click", function() {
        nested.forEach((d) => {
            d.values.sort((a,b)=>d3.ascending(b.lum,a.lum))
            d.values.forEach((p,i)=>{
                p.ypos = i;
            })
        })

        histogramValues = d3.histogram()
            .value(function(d) {return d.lum})
            .domain(satScale.domain())
            .thresholds(satScale.ticks(20))

        bins = histogramValues(colors)
        
        colors.forEach((g) => {
            bins.forEach((bin) => {
                bin.forEach((d,i) => {
                    d.bucket = bin.x0;
                })
                if(bin.date === g.date) {
                    g.bucket = bin.x0;
                }
            })
        })
        
        colorNest = d3.nest()
            .key(d=>d.bucket)
            .key(d=>d.lum)
            .key(d=>d.color)
            .rollup(function(v) { return v.length;})
            .entries(colors)

        colorNest.forEach((d) => {
            d.key = +d.key;
            d.values.forEach((p) => {
                p.key = +p.key;
            })
            d.values.sort((a,b)=>d3.ascending(a.key,b.key))
        })
    
        colorNest.sort((a,b)=>d3.ascending(a.key,b.key))

        hierarchy = d3.hierarchy({values: colorNest}, function(d) { return d.values; })
            .sum(function(d) { return d.value; });
        root = treemap(hierarchy);

        tree = treePanel.selectAll("rect")
            .data(root.leaves())
            
        let treeEnter = tree.enter()
            .append("rect")
            .attr("x", function(d) { return d.x0; })
            .attr("y", function(d) { return d.y0; })
            .attr("class", d => d.data.key)
            .attr("width", function(d) { return d.x1 - d.x0; })
            .attr("height", function(d) { return d.y1 - d.y0; })
            .attr("fill", function(d) { 
                return d.data.key;
                    })
            .attr("stroke", "#efe8e6");

        tree.merge(treeEnter)
            .transition()
            .duration(500)
            .attr("x", function(d) { return d.x0; })
            .attr("y", function(d) { return d.y0; })
            .attr("class", d => d.data.key)
            .attr("width", function(d) { return d.x1 - d.x0; })
            .attr("height", function(d) { return d.y1 - d.y0; })
            .attr("fill", function(d) { 
                return d.data.key;
                    })
            .attr("stroke", "#efe8e6");

        tree.exit()
            .transition()
            .duration(500)
            .attr("opacity", 0)
            .remove();

        grouping.selectAll("rect").transition().duration(500).attr("y", function(p) { return yScale(p.ypos); })

        let mouseTree = treePanel.selectAll(".mouse")
        .data(root.children)

    let mouseTreeEnter = mouseTree.enter()
        .append("rect")
        .attr("x", function(d) { return d.x0; })
        .attr("y", function(d) { return d.y0; })
        .attr("class", "mouse")
        .attr("width", function(d) { return d.x1 - d.x0; })
        .attr("height", function(d) { return d.y1 - d.y0; })
        .style("fill", "transparent")
        .attr("stroke", "none")

    mouseTree.merge(mouseTreeEnter)
        .transition()
        .duration(500)
        .attr("x", function(d) { return d.x0; })
        .attr("y", function(d) { return d.y0; })
        .attr("class", "mouse")
        .attr("width", function(d) { return d.x1 - d.x0; })
        .attr("height", function(d) { return d.y1 - d.y0; })
        .style("fill", "transparent")
        .attr("stroke", "none")   
        

    mouseTree.exit()
        .transition()
        .duration(500)
        .remove();

    d3.selectAll(".mouse")
        .on('click', function(p) {
            let filteredColors = colors.filter(d=>d.bucket === p.data.key)
            let colorList = [];
            filteredColors.forEach(d=>
                    colorList.push(d.color)
                )
            tree = treePanel.selectAll("rect")
                .transition().duration(500)
                .attr("opacity", (d) => {
                    let color = d.data.key
                    if(colorList.indexOf(color) > 0) {
                        return 1;
                    } else {
                        return 0.15;
                    }
                })

            nested.forEach((d) => {
                d.filtered = d.values.filter(g=>g.bucket === p.data.key)
                let stackHeight = d.filtered.length * barHeight;
                d.offset = stackHeight/2;
                d.filtered.forEach((g,i)=>{
                    g.ypos = i;
                })
            })
    
            grouping.transition().duration(500)
                .attr("transform", (d) => `translate(${xScale(d.key)},${d.offset})`)
            
            bars = grouping.selectAll("rect").data(d=>d.filtered)
            enter = bars.enter()
                .append("rect")
                .attr("width", barWidth)
                .attr("height", barHeight)
                .attr("fill", g=>g.color)
                .attr("y", function(g) { return yScale(g.ypos); })
                .attr("opacity", 0)
            bars.merge(enter).transition()
                .duration(500)
                .attr("width", barWidth)
                .attr("height", barHeight)
                .attr("fill", g=>g.color)
                .attr("y", function(g) { return yScale(g.ypos); })
                .attr("opacity", 1)
    
            bars.exit()
                .transition()
                .duration(500)
                .attr("opacity", 0)
                .remove(); 
            
        })
    })

    hueBtn.on("click", function() {
        nested.forEach((d) => {
            d.values.sort((a,b)=>d3.ascending(b.hue,a.hue))
            d.values.forEach((p,i)=>{
                p.ypos = i;
            })
        })

        histogramValues = d3.histogram()
            .value(function(d) {return d.hue})
            .domain(hueScale.domain())
            .thresholds(hueScale.ticks(24))

        bins = histogramValues(colors)
        
        colors.forEach((g) => {
            bins.forEach((bin) => {
                bin.forEach((d,i) => {
                    d.bucket = bin.x0;
                })
                if(bin.date === g.date) {
                    g.bucket = bin.x0;
                }
            })
        })
        
        colorNest = d3.nest()
            .key(d=>d.bucket)
            .key(d=>d.hue)
            .key(d=>d.color)
            .rollup(function(v) { return v.length;})
            .entries(colors)

        colorNest.forEach((d) => {
            d.key = +d.key;
            d.values.forEach((p) => {
                p.key = +p.key;
            })
            d.values.sort((a,b)=>d3.ascending(a.key,b.key))
        })
    
        colorNest.sort((a,b)=>d3.ascending(a.key,b.key))

        hierarchy = d3.hierarchy({values: colorNest}, function(d) { return d.values; })
            .sum(function(d) { return d.value; });
        root = treemap(hierarchy);

        tree = treePanel.selectAll("rect")
            .data(root.leaves())
            
        let treeEnter = tree.enter()
            .append("rect")
            .attr("x", function(d) { return d.x0; })
            .attr("y", function(d) { return d.y0; })
            .attr("class", d => d.data.key)
            .attr("width", function(d) { return d.x1 - d.x0; })
            .attr("height", function(d) { return d.y1 - d.y0; })
            .attr("fill", function(d) { 
                return d.data.key;
                    })
            .attr("stroke", "#efe8e6");

        tree.merge(treeEnter)
            .transition()
            .duration(500)
            .attr("x", function(d) { return d.x0; })
            .attr("y", function(d) { return d.y0; })
            .attr("class", d => d.data.key)
            .attr("width", function(d) { return d.x1 - d.x0; })
            .attr("height", function(d) { return d.y1 - d.y0; })
            .attr("fill", function(d) { 
                return d.data.key;
                    })
            .attr("stroke", "#efe8e6");

        tree.exit()
            .transition()
            .duration(500)
            .attr("opacity", 0)
            .remove();

        grouping.selectAll("rect").transition().duration(500).attr("y", function(p) { return yScale(p.ypos); })

        let mouseTree = treePanel.selectAll(".mouse")
        .data(root.children)

    let mouseTreeEnter = mouseTree.enter()
        .append("rect")
        .attr("x", function(d) { return d.x0; })
        .attr("y", function(d) { return d.y0; })
        .attr("class", "mouse")
        .attr("width", function(d) { return d.x1 - d.x0; })
        .attr("height", function(d) { return d.y1 - d.y0; })
        .style("fill", "transparent")
        .attr("stroke", "none")

    mouseTree.merge(mouseTreeEnter)
        .transition()
        .duration(500)
        .attr("x", function(d) { return d.x0; })
        .attr("y", function(d) { return d.y0; })
        .attr("class", "mouse")
        .attr("width", function(d) { return d.x1 - d.x0; })
        .attr("height", function(d) { return d.y1 - d.y0; })
        .style("fill", "transparent")
        .attr("stroke", "none")   

    mouseTree.exit()
        .transition()
        .duration(500)
        .remove();

    d3.selectAll(".mouse")
        .on('click', function(p) {
            let filteredColors = colors.filter(d=>d.bucket === p.data.key)
            let colorList = [];
            filteredColors.forEach(d=>
                    colorList.push(d.color)
                )
            tree = treePanel.selectAll("rect")
                .transition().duration(500)
                .attr("opacity", (d) => {
                    let color = d.data.key
                    if(colorList.indexOf(color) > 0) {
                        return 1;
                    } else {
                        return 0.15;
                    }
                })

            nested.forEach((d) => {
                d.filtered = d.values.filter(g=>g.bucket === p.data.key)
                let stackHeight = d.filtered.length * barHeight;
                d.offset = stackHeight/2;
                d.filtered.forEach((g,i)=>{
                    g.ypos = i;
                })
            })
    
            grouping.transition().duration(500)
                .attr("transform", (d) => `translate(${xScale(d.key)},${d.offset})`)
            
            bars = grouping.selectAll("rect").data(d=>d.filtered)
            enter = bars.enter()
                .append("rect")
                .attr("width", barWidth)
                .attr("height", barHeight)
                .attr("fill", g=>g.color)
                .attr("y", function(g) { return yScale(g.ypos); })
                .attr("opacity", 0)
            bars.merge(enter).transition()
                .duration(500)
                .attr("width", barWidth)
                .attr("height", barHeight)
                .attr("fill", g=>g.color)
                .attr("y", function(g) { return yScale(g.ypos); })
                .attr("opacity", 1)
    
            bars.exit()
                .transition()
                .duration(500)
                .attr("opacity", 0)
                .remove(); 
            
        })
    })

    shelvesBtn.on("click", function() {
        let stackHeights = [];
        let heightNest;
        // d3.selectAll(".axis").style("opacity", 0);
        barHeight = 0.25;
        yScale.domain([0,85])
        margin.top = 0;
        margin.bottom = 0;
        nested.forEach((d) => {
            
            let weekNest = d3.nest()
                .key(p=>p.bucket)
                .rollup()
                .entries(d.values)
            weekNest.forEach((p)=> {
                p.key = +p.key
                stackHeights.push({
                    week: d.key,
                    bucket: p.key,
                    stackHeight: p.values.length
                })
            })
            
            weekNest.sort((a,b) => d3.ascending(b.key,a.key))
            d.weekNest = weekNest
            
        })
        heightNest = d3.nest()
            .key(p=>p.bucket)
            .rollup()
            .entries(stackHeights)
        heightNest.forEach((p,i)=>{
            p.key=+p.key
            p.maxHeight = d3.max(p.values, m=>m.stackHeight)
        })
        
        heightNest.sort((a,b) => d3.ascending(b.key,a.key))
        heightNest[0].offset = 0;
        for(j = 1; j < heightNest.length; j++) {
            
            
            heightNest[j].offset = heightNest[j-1].offset + heightNest[j-1].maxHeight + 1;

        }
        nested.forEach((d) => {
            d.values.forEach((p) => {
                heightNest.forEach((m) => {
                    if(p.bucket === m.key) {
                        p.offset = m.offset;
                    }
                })   
            }) 

            d.weekNest.forEach((p) => {
                p.values.forEach((m,i) => {
                    m.ypos = m.offset + i;
                })
            })
            })

        grouping.transition().duration(500)
            .attr("transform", (d) => `translate(${xScale(d.key)},${0.38*height})`)
        grouping.selectAll("rect").transition().duration(500).attr("y", function(p) { return yScale(p.ypos); })
    })

    dropDown.on("change", function() {
        nested.forEach((d) => {
            d.filtered = d.values.filter(p=>p.brand === this.value)
            let stackHeight = d.filtered.length * barHeight;
            d.offset = stackHeight/2;
            d.filtered.forEach((p,i)=>{
                p.ypos = i;
            })
        })

        grouping.transition().duration(500)
            .attr("transform", (d) => `translate(${xScale(d.key)},${d.offset})`)
        
        bars = grouping.selectAll("rect").data(d=>d.filtered)
        enter = bars.enter()
            .append("rect")
            .attr("width", barWidth)
            .attr("height", barHeight)
            .attr("fill", p=>p.color)
            .attr("y", function(p) { return yScale(p.ypos); })
            .attr("opacity", 0)
        bars.merge(enter).transition()
            .duration(500)
            .attr("width", barWidth)
            .attr("height", barHeight)
            .attr("fill", p=>p.color)
            .attr("y", function(p) { return yScale(p.ypos); })
            .attr("opacity", 1)

        bars.exit()
            .transition()
            .duration(500)
            .attr("opacity", 0)
            .remove(); 
    })

    resetBtn.on("click", function() {
        barHeight = 5;
        yScale.domain([0,60]);
        xAxis.style("opacity", 1);
        nested.forEach((d) => {
            // d.values.sort((a,b)=>d3.ascending(b.hue,a.hue))
            let stackHeight = d.values.length * barHeight;
            d.offset = stackHeight/3;
            d.values.forEach((p,i)=>{
                p.ypos = i;
            })
        })

        grouping.transition().duration(500)
            .attr("transform", (d) => `translate(${xScale(d.key)},${d.offset})`)
        
        bars = grouping.selectAll("rect").data(d=>d.values)
        enter = bars.enter()
            .append("rect")
            .attr("width", barWidth)
            .attr("height", barHeight)
            .attr("fill", p=>p.color)
            .attr("y", function(p) { return yScale(p.ypos); })
            .attr("opacity", 0)
        bars.merge(enter).transition()
            .duration(500)
            .attr("width", barWidth)
            .attr("height", barHeight)
            .attr("fill", p=>p.color)
            .attr("y", function(p) { return yScale(p.ypos); })
            .attr("opacity", 1)

        bars.exit()
            .transition()
            .duration(500)
            .attr("opacity", 0)
            .remove();

        tree = treePanel.selectAll("rect")
            .transition().duration(500)
            .attr("opacity", 1)
    })

    streamBtn.on("click", function() {
        barHeight = 5;
        yScale.domain([0,60]);
        xAxis.style("opacity", 1);
        nested.forEach((d) => {
            // d.values.sort((a,b)=>d3.ascending(b.hue,a.hue))
            let stackHeight = d.values.length * barHeight;
            d.offset = stackHeight/3;
            d.values.forEach((p,i)=>{
                p.ypos = i;
            })
        })

        grouping.transition().duration(500)
            .attr("transform", (d) => `translate(${xScale(d.key)},${d.offset})`)
        
        bars = grouping.selectAll("rect").data(d=>d.values)
        enter = bars.enter()
            .append("rect")
            .attr("width", barWidth)
            .attr("height", barHeight)
            .attr("fill", p=>p.color)
            .attr("y", function(p) { return yScale(p.ypos); })
            .attr("opacity", 0)
        bars.merge(enter).transition()
            .duration(500)
            .attr("width", barWidth)
            .attr("height", barHeight)
            .attr("fill", p=>p.color)
            .attr("y", function(p) { return yScale(p.ypos); })
            .attr("opacity", 1)

        bars.exit()
            .transition()
            .duration(500)
            .attr("opacity", 0)
            .remove();

        tree = treePanel.selectAll("rect")
            .transition().duration(500)
            .attr("opacity", 1)
    })
    
     
    // nrmlBtn.on("click", function() {
        
    //     nested.forEach((d) => {
            
    //         // d.offset = 0;
    //         let variableHeight = height / d.values.length;
    //         d.values.sort((a,b)=>d3.ascending(a.hue,b.hue))
    //         d.values.forEach((p,i) => {
    //             p.variableHeight = variableHeight;
    //             p.ypos = i * variableHeight;
    //         })
    //         // yScale.domain([0,d.values.length / variableHeight])
            
    //     })
    //     console.log(nested)
        
    //     grouping.transition().duration(500)
    //         .attr("transform", (d) => `translate(${xScale(d.key)},0)`)
    //     grouping.selectAll("rect").transition().duration(500)
    //         .attr("height", d=>d.variableHeight)
    //         .attr("y", d=>d.ypos)
    // })   

   
});

function parse(d) {

    return {
        date: new Date(d.date),
        week: +d.week,
        day: +d.day,
        description: (d.Brand + " ").concat((d.Description + " ")).concat(d.Sub_Category),
        id: +d.garmentId,
        group: d.group,
        brand: d.Brand,
        hex1: d.hex1,
        hex2: d.hex2,
        hex3: d.hex3,
        hex4: d.hex4,
        hex5: d.hex5,
        new: d.new,
        sold: d.sold
    }
    
}

function HEXtoHSL(hex) {
    hex = hex.replace(/#/g, '');
    if (hex.length === 3) {
        hex = hex.split('').map(function (hex) {
            return hex + hex;
        }).join('');
    }
    var result = /^([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})[\da-z]{0,0}$/i.exec(hex);
    if (!result) {
        return null;
    }
    var r = parseInt(result[1], 16);
    var g = parseInt(result[2], 16);
    var b = parseInt(result[3], 16);
    r /= 255, g /= 255, b /= 255;
    var max = Math.max(r, g, b),
        min = Math.min(r, g, b);
    var h, s, l = (max + min) / 2;
    if (max == min) {
        h = s = 0;
    } else {
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
        case r:
            h = (g - b) / d + (g < b ? 6 : 0);
            break;
        case g:
            h = (b - r) / d + 2;
            break;
        case b:
            h = (r - g) / d + 4;
            break;
        }
        h /= 6;
    }
    s = s * 100;
    s = Math.round(s);
    l = l * 100;
    l = Math.round(l);
    h = Math.round(360 * h);

    return {
        h: h,
        s: s,
        l: l
    };
}

function ISO8601_week_no(dt) {
     var tdt = new Date(dt.valueOf());
     var dayn = (dt.getDay() + 6) % 7;
     tdt.setDate(tdt.getDate() - dayn + 3);
     var firstThursday = tdt.valueOf();
     tdt.setMonth(0, 1);
     if (tdt.getDay() !== 4) 
       {
      tdt.setMonth(0, 1 + ((4 - tdt.getDay()) + 7) % 7);
        }
     return 1 + Math.ceil((firstThursday - tdt) / 604800000);
        }
