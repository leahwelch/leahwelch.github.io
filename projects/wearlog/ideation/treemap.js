var width = document.querySelector("#chart").clientWidth;
var height = document.querySelector("#chart").clientHeight;
var margin = {top: 250, left: 250, right: 20, bottom: 50};

console.log(width);
console.log(height);

var svg = d3.select("#chart")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

var format = d3.format(",d");

// var color = d3.scaleOrdinal()
//     .range(d3.schemeCategory10
//         .map(function(c) { c = d3.rgb(c); c.opacity = 0.6; return c; }));

// var stratify = d3.stratify()
//     .parentId(function(d) { return d.id.substring(0, d.id.lastIndexOf(".")); });

var treemap = d3.treemap()
    .size([width, height])
    .padding(1)
    .round(true);

const promises = [
    d3.csv("./data/wearlog.csv", parse)
];

Promise.all(promises).then(function(allData) {

    let data = allData[0]
        // .filter(d=>d.date < new Date("2021-11-15") && d.date > new Date("2021-10-04"))

    data.forEach(function(d) {
        if(d.brand === '') {
            d.brand = 'Vintage';
        }
    })

    let colors = [];
    for(let i = 0; i < data.length; i++) {
        colors.push(data[i].hex1)
        colors.push(data[i].hex2)
        colors.push(data[i].hex3)
        colors.push(data[i].hex4)
        colors.push(data[i].hex5)
    }

    let nested = d3.nest()
        .key(function(d) { return d})
        .rollup(function(v) { return v.length;})
        .entries(colors)

    nested.forEach((d) => {
        d.hsl = HEXtoHSL(d.key)
        d.hue = d.hsl.h
    })

    nested.sort((a,b) => d3.ascending(a.hue,b.hue))
    

    const hueScale = d3.scaleLinear()
        .domain([0,360])
        .range([margin.left, width-margin.right])

    let histogramValues = d3.histogram()
        .value(function(d) {return d.hue})
        .domain(hueScale.domain())
        .thresholds(hueScale.ticks(24))

    let bins = histogramValues(nested);
    console.log(bins)
    
    nested.forEach((g) => {
        bins.forEach((bin) => {
            bin.forEach((d,i) => {
                d.bucket = bin.x0;
            })
            if(bin.key === g.key) {
                nested.push({bucket: bin.x0})
            }
        })
    })
    console.log(nested)

    let doubleNest = d3.nest()
        .key(d=>d.bucket)
        .key(d=>d.hue)
        .entries(nested)
    var hierarchy = d3.hierarchy({values: doubleNest}, function(d) { return d.values; })
        .sum(function(d) { return d.value; });

    var root = treemap(hierarchy);

    var rect = svg.selectAll("rect")
        .data(root.leaves())
        .enter()
        .append("rect")
            .attr("x", function(d) { return d.x0; })
            .attr("y", function(d) { return d.y0; })
            .attr("width", function(d) { return d.x1 - d.x0; })
            .attr("height", function(d) { return d.y1 - d.y0; })
            .attr("fill", function(d) { 
                return d.data.key;
                 })
            .attr("stroke", "#FFFFFF");

});

function parse(d) {

    return {
        date: new Date(d.date),
        description: (d.Brand + " ").concat((d.Description + " ")).concat(d.Sub_Category),
        brand: d.Brand,
        id: +d.garmentId,
        group: d.group,
        hex1: d.hex1,
        hex2: d.hex2,
        hex3: d.hex3,
        hex4: d.hex4,
        hex5: d.hex5,
        sold: d.sold,
        new: d.new
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