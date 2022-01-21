var width = document.querySelector("#chart1").clientWidth;
var height = document.querySelector("#chart1").clientHeight;
var margin = {top: 200, left: 0, right: 70, bottom: 400};
console.log(height)

var treeWidth = document.querySelector("#tree1").clientWidth;
var treeHeight = document.querySelector("#tree1").clientHeight;
var treeMargin = {top: 20, left: 20, right: 0, bottom: 20};

var svg = d3.select("#chart1")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

var treePanel = d3.select("#tree1")
    .append("svg")
    .attr("width", treeWidth)
    .attr("height", treeHeight);

var svg2 = d3.select("#chart2")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

var treePanel2 = d3.select("#tree2")
    .append("svg")
    .attr("width", treeWidth)
    .attr("height", treeHeight);

var treemap = d3.treemap()
    .size([treeWidth, treeHeight])
    .padding(0.5)
    .round(true)

let barHeight = 5;
const chartHeight = height - margin.bottom - margin.top;
const barWidth = 20;

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

    let data1 = data.filter((d) => {
        return d.date < new Date("2021-01-21");
    })

    let data2 = data.filter((d) => {
        return d.date > new Date("2021-10-05");
    })

    let year1items = d3.nest()
        .key(d=>d.brand)
        .key(d=>d.id)
        .rollup(function(v) { return v.length;})
        .entries(data1)

    year1items.forEach((d) => {
        d.values.sort((a,b)=>b.value-a.value);
    })

    let year2items = d3.nest()
        .key(d=>d.brand)
        .key(d=>d.id)
        .rollup(function(v) { return v.length;})
        .entries(data2)

    year2items.forEach((d) => {
        d.values.sort((a,b)=>b.value-a.value);
    })

    

    console.log(year1items)
    console.log(year2items)

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

    let colors1 = [];
    for(let i = 0; i < data1.length; i++) {
        colors1.push({color: data1[i].hex1, date: data1[i].date, id: data1[i].id, description: data1[i].description, week: data1[i].week, brand: data1[i].brand, day: data1[i].day})
        colors1.push({color: data1[i].hex2, date: data1[i].date, id: data1[i].id, description: data1[i].description, week: data1[i].week, brand: data1[i].brand, day: data1[i].day})
        colors1.push({color: data1[i].hex3, date: data1[i].date, id: data1[i].id, description: data1[i].description, week: data1[i].week, brand: data1[i].brand, day: data1[i].day})
        colors1.push({color: data1[i].hex4, date: data1[i].date, id: data1[i].id, description: data1[i].description, week: data1[i].week, brand: data1[i].brand, day: data1[i].day})
        colors1.push({color: data1[i].hex5, date: data1[i].date, id: data1[i].id, description: data1[i].description, week: data1[i].week, brand: data1[i].brand, day: data1[i].day})
    }

    colors1.forEach((d) => {
        d.hsl = HEXtoHSL(d.color)
        d.hue = d.hsl.h
        d.sat = d.hsl.s
        d.lum = d.hsl.l
    })

    colors1.sort((a,b) => d3.ascending(a.date,b.date))

    let colors2 = [];
    for(let i = 0; i < data2.length; i++) {
        colors2.push({color: data2[i].hex1, date: data2[i].date, id: data2[i].id, description: data2[i].description, week: data2[i].week, brand: data2[i].brand, day: data2[i].day})
        colors2.push({color: data2[i].hex2, date: data2[i].date, id: data2[i].id, description: data2[i].description, week: data2[i].week, brand: data2[i].brand, day: data2[i].day})
        colors2.push({color: data2[i].hex3, date: data2[i].date, id: data2[i].id, description: data2[i].description, week: data2[i].week, brand: data2[i].brand, day: data2[i].day})
        colors2.push({color: data2[i].hex4, date: data2[i].date, id: data2[i].id, description: data2[i].description, week: data2[i].week, brand: data2[i].brand, day: data2[i].day})
        colors2.push({color: data2[i].hex5, date: data2[i].date, id: data2[i].id, description: data2[i].description, week: data2[i].week, brand: data2[i].brand, day: data2[i].day})
    }

    colors2.forEach((d) => {
        d.hsl = HEXtoHSL(d.color)
        d.hue = d.hsl.h
        d.sat = d.hsl.s
        d.lum = d.hsl.l
    })

    colors2.sort((a,b) => d3.ascending(a.date,b.date))

    let histogramValues = d3.histogram()
        .value(function(d) {return d.hue})
        .domain(hueScale.domain())
        .thresholds(hueScale.ticks(20))

    let bins = histogramValues(colors1)
    let bins2 = histogramValues(colors2)

    colors1.forEach((g) => {
        bins.forEach((bin) => {
            bin.forEach((d,i) => {
                d.bucket = bin.x0;
            })
            if(bin.date === g.date) {
                g.bucket = bin.x0;
            }
        })
    })

    colors2.forEach((g) => {
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
        .entries(colors1)

    let nested2 = d3.nest()
        .key(d=>d.week)
        .rollup()
        .entries(colors2)

    nested.forEach((d) => {
        let stackHeight = d.values.length * barHeight;
        d.offset = stackHeight/3;
        d.key = +d.key
        d.values.sort((a,b)=>d3.ascending(b.hue,a.hue))
        d.values.forEach((p,i)=>{
            p.ypos = i;
        })
    })

    nested2.forEach((d) => {
        let stackHeight = d.values.length * barHeight;
        d.offset = stackHeight/3;
        d.key = +d.key
        d.values.sort((a,b)=>d3.ascending(b.hue,a.hue))
        d.values.forEach((p,i)=>{
            p.ypos = i;
        })
    })

    let colorNest = d3.nest()
        .key(d=>d.bucket)
        .key(d=>d.hue)
        .key(d=>d.color)
        .rollup(function(v) { return v.length;})
        .entries(colors1)

    colorNest.forEach((d) => {
        d.key = +d.key;
        d.values.forEach((p) => {
            p.key = +p.key;
        })
        d.values.sort((a,b)=>d3.ascending(a.key,b.key))
    })

    colorNest.sort((a,b)=>d3.ascending(a.key,b.key))

    let colorNest2 = d3.nest()
        .key(d=>d.bucket)
        .key(d=>d.hue)
        .key(d=>d.color)
        .rollup(function(v) { return v.length;})
        .entries(colors2)

    colorNest2.forEach((d) => {
        d.key = +d.key;
        d.values.forEach((p) => {
            p.key = +p.key;
        })
        d.values.sort((a,b)=>d3.ascending(a.key,b.key))
    })

    colorNest2.sort((a,b)=>d3.ascending(a.key,b.key))

    let hierarchy = d3.hierarchy({values: colorNest}, function(d) { return d.values; })
        .sum(function(d) { return d.value; });

    let root = treemap(hierarchy);

    let hierarchy2 = d3.hierarchy({values: colorNest2}, function(d) { return d.values; })
        .sum(function(d) { return d.value; });

    let root2 = treemap(hierarchy2);

    const xScale = d3.scaleLinear()
        .domain([1,66])
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

    const grouping2 = svg2.selectAll(".stackGroup")
        .data(nested2)
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

    let bars2 = grouping2.selectAll("rect").data(d=>d.values)

    let enter2 = bars2.enter()
        .append("rect")
        .attr("width", barWidth)
        .attr("height", barHeight)
        .attr("fill", p=>p.color)
        .attr("y", function(p) { return yScale(p.ypos); })

    bars2.merge(enter)
        .transition()
        .duration(500)
        .attr("width", barWidth)
        .attr("height", barHeight)
        .attr("fill", p=>p.color)
        .attr("y", function(p) { return yScale(p.ypos); })
        .attr("opacity",1)
        
    bars2.exit()
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
    
    let tree2 = treePanel2.selectAll("rect")
        .data(root2.leaves())

    let treeEnter2 = tree2.enter()
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

    tree2.merge(treeEnter2)
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

    tree2.exit()
        .transition()
        .duration(500)
        .attr("opacity", 0)
        .remove();

   
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
