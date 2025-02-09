

var width = document.querySelector("#chart").clientWidth;
var height = document.querySelector("#chart").clientHeight;
var margin = {top: 150, left: 0, right: 55, bottom: 400};

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
    // .tile(tile);

const barHeight = 5;
const chartHeight = height - margin.bottom - margin.top;
const barWidth = 20

const hueBtn = d3.select("#hueBtn")
const satBtn = d3.select("#satBtn")
const lumBtn = d3.select("#lumBtn")
const shelvesBtn = d3.select("#shelves")
const resetBtn = d3.select("#reset")
const dropDown = d3.select("#dropdownArea").append("select")
    .attr("name", "brandList");

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
        colors.push({color: data[i].hex1, date: data[i].date, id: data[i].id, description: data[i].description, week: data[i].week, brand: data[i].brand})
        colors.push({color: data[i].hex2, date: data[i].date, id: data[i].id, description: data[i].description, week: data[i].week, brand: data[i].brand})
        colors.push({color: data[i].hex3, date: data[i].date, id: data[i].id, description: data[i].description, week: data[i].week, brand: data[i].brand})
        colors.push({color: data[i].hex4, date: data[i].date, id: data[i].id, description: data[i].description, week: data[i].week, brand: data[i].brand})
        colors.push({color: data[i].hex5, date: data[i].date, id: data[i].id, description: data[i].description, week: data[i].week, brand: data[i].brand})
    }

    colors.forEach((d) => {
        d.hsl = HEXtoHSL(d.color)
        d.hue = d.hsl.h
        d.sat = d.hsl.s
        d.lum = d.hsl.l
    })

    colors.sort((a,b) => d3.ascending(a.date,b.date))

    let colorNest = d3.nest()
        .key(function(d) { return d.color})
        .rollup(function(v) { return v.length;})
        .entries(colors)

    colorNest.forEach((d) => {
        d.hsl = HEXtoHSL(d.key)
        d.hue = d.hsl.h
    })

    colorNest.sort((a,b) => d3.ascending(a.hue,b.hue))

    let histogramValues = d3.histogram()
        .value(function(d) {return d.hue})
        .domain(hueScale.domain())
        .thresholds(hueScale.ticks(24))

    let bins = histogramValues(colors)
    let colorBins = histogramValues(colorNest)
    

    colorNest.forEach((g) => {
        colorBins.forEach((bin) => {
            bin.forEach((d,i) => {
                d.bucket = bin.x0;
            })
            if(bin.key === g.key) {
                colorNest.push({bucket: bin.x0})
            }
        })
    })
    

    let doubleNest = d3.nest()
        
        .key(d=>d.bucket)
        .key(d=>d.hue)
    //     // .rollup(function(v) { return v.length;})
        .rollup()
        
        .entries(colorNest)

    // let topNest = d3.nest()
    //     .key(d=>d.bucket)
    //     .rollup(function(v) { return v.length;})
    //     .entries(colorNest)

    doubleNest.forEach(d => d.key = +d.key)
    doubleNest = doubleNest.filter(d=>d.key === 0)
    // topNest.forEach(d => d.key = +d.key)

    console.log(doubleNest)
    
    // let hierarchy = d3.hierarchy({values: doubleNest}, function(d) { return d.values; })
    //     .sum(function(d) { return d.value; });
    let hierarchy = d3.hierarchy({values: doubleNest}, function(d) { return d.values; })
        .sum(function(d) { return d.value; });

    let root = treemap(hierarchy);

    // console.log(root.children)

    colors.forEach((g) => {
        bins.forEach((bin) => {
            bin.forEach((d,i) => {
                d.bucket = bin.x0;
            })
            if(bin.date === g.date) {
                colors.push({bucket: bin.x0})
            }
        })
    })

    let nested = d3.nest()
        .key(d=>d.week)
        .rollup()
        .entries(colors)

    nested.forEach((d) => {
        let stackHeight = d.values.length * barHeight;
        d.offset = stackHeight/2;
        d.key = +d.key
        d.values.sort((a,b)=>d3.ascending(b.hue,a.hue))
        d.values.forEach((p,i)=>{
            p.ypos = i;
        })
    })

    const xScale = d3.scaleLinear()
        .domain([1,60])
        .range([margin.left, width-margin.right])

    const yScale = d3.scaleLinear()
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
        .attr("stroke", "#FFFFFF");

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
        .attr("stroke", "#FFFFFF");

    tree.exit()
        .transition()
        .duration(500)
        .attr("opacity", 0)
        .remove();


    satBtn.on("click", function() {
        nested.forEach((d) => {
            d.values.sort((a,b)=>d3.ascending(b.sat,a.sat))
            d.values.forEach((p,i)=>{
                p.ypos = i;
            })
        })
        grouping.selectAll("rect").transition().duration(500).attr("y", function(p) { return yScale(p.ypos); })

        colorNest.forEach((d) => {
            d.hue = d.hsl.s 
        })
        histogramValues = d3.histogram()
            .value(function(d) {return d.hue})
            .domain(satScale.domain())
            .thresholds(satScale.ticks(20))
        colorBins = histogramValues(colorNest)
        console.log(colorBins)

        colorNest.forEach((d) => {
            colorBins.forEach((bin) => {
                bin.forEach((g,i) => {
                    g.bucket = bin.x0;
                })
                if(bin.key === d.key) {
                    colorNest.push({bucket: bin.x0})
                }
            })
        })

        doubleNest = d3.nest()
            .key(d=>d.bucket)
            .key(d=>d.hue)
            .entries(colorNest)

        doubleNest.forEach(d => d.key = +d.key)
        doubleNest.sort((a,b)=>d3.ascending(a.key,b.key))

        console.log(doubleNest)
        hierarchy = d3.hierarchy({values: doubleNest}, function(d) { return d.values; })
            .sum(function(d) { return d.value; });
        root = treemap(hierarchy);

        tree = treePanel.selectAll("rect")
            // .data(root.leaves())
            .data(root.children)
            
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
            .attr("stroke", "#FFFFFF");

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
            .attr("stroke", "#FFFFFF");

        tree.exit()
            .transition()
            .duration(500)
            .attr("opacity", 0)
            .remove();
        
    })

    lumBtn.on("click", function() {
        nested.forEach((d) => {
            d.values.sort((a,b)=>d3.ascending(b.lum,a.lum))
            d.values.forEach((p,i)=>{
                p.ypos = i;
            })
        })

        colorNest.forEach((d) => {
            d.hue = d.hsl.l 
        })
        histogramValues = d3.histogram()
            .value(function(d) {return d.hue})
            .domain(satScale.domain())
            .thresholds(satScale.ticks(20))
        colorBins = histogramValues(colorNest)
        console.log(colorBins)

        colorNest.forEach((d) => {
            colorBins.forEach((bin) => {
                bin.forEach((g,i) => {
                    g.bucket = bin.x0;
                })
                if(bin.key === d.key) {
                    colorNest.push({bucket: bin.x0})
                }
            })
        })

        doubleNest = d3.nest()
            .key(d=>d.bucket)
            .key(d=>d.hue)
            .entries(colorNest)

        doubleNest.forEach(d => d.key = +d.key)
        doubleNest.sort((a,b)=>d3.ascending(a.key,b.key))

        console.log(doubleNest)
        hierarchy = d3.hierarchy({values: doubleNest}, function(d) { return d.values; })
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
            .attr("stroke", "#FFFFFF");

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
            .attr("stroke", "#FFFFFF");

        tree.exit()
            .transition()
            .duration(500)
            .attr("opacity", 0)
            .remove();

        grouping.selectAll("rect").transition().duration(500).attr("y", function(p) { return yScale(p.ypos); })
    })

    hueBtn.on("click", function() {
        nested.forEach((d) => {
            d.values.sort((a,b)=>d3.ascending(b.hue,a.hue))
            d.values.forEach((p,i)=>{
                p.ypos = i;
            })
        })

        colorNest.forEach((d) => {
            d.hue = d.hsl.h 
        })
        histogramValues = d3.histogram()
            .value(function(d) {return d.hue})
            .domain(hueScale.domain())
            .thresholds(hueScale.ticks(24))
        colorBins = histogramValues(colorNest)
        console.log(colorBins)

        colorNest.forEach((d) => {
            colorBins.forEach((bin) => {
                bin.forEach((g,i) => {
                    g.bucket = bin.x0;
                })
                if(bin.key === d.key) {
                    colorNest.push({bucket: bin.x0})
                }
            })
        })

        doubleNest = d3.nest()
            .key(d=>d.bucket)
            .key(d=>d.hue)
            .entries(colorNest)

        doubleNest.forEach(d => d.key = +d.key)
        doubleNest.sort((a,b)=>d3.ascending(a.key,b.key))

        console.log(doubleNest)
        hierarchy = d3.hierarchy({values: doubleNest}, function(d) { return d.values; })
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
            .attr("stroke", "#FFFFFF");

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
            .attr("stroke", "#FFFFFF");

        tree.exit()
            .transition()
            .duration(500)
            .attr("opacity", 0)
            .remove();

        grouping.selectAll("rect").transition().duration(500).attr("y", function(p) { return yScale(p.ypos); })
    })

    shelvesBtn.on("click", function() {

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
        nested.forEach((d) => {
            let stackHeight = d.values.length * barHeight;
            d.offset = stackHeight/2;
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
    })
    
        

   
});

function parse(d) {

    return {
        date: new Date(d.date),
        week: +d.week,
        description: (d.Brand + " ").concat((d.Description + " ")).concat(d.Sub_Category),
        id: +d.garmentId,
        group: d.group,
        brand: d.Brand,
        hex1: d.hex1,
        hex2: d.hex2,
        hex3: d.hex3,
        hex4: d.hex4,
        hex5: d.hex5
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

function tile(node, x0, y0, x1, y1) {
    d3.treemapBinary(node, 0, 0, width, height);
    for (const child of node.children) {
        child.x0 = x0 + child.x0 / width * (x1 - x0);
        child.x1 = x0 + child.x1 / width * (x1 - x0);
        child.y0 = y0 + child.y0 / height * (y1 - y0);
        child.y1 = y0 + child.y1 / height * (y1 - y0);
    }
    }