var width = document.querySelector("#chart").clientWidth;
var height = document.querySelector("#chart").clientHeight;
var margin = {top: 250, left: 250, right: 20, bottom: 50};

console.log(width);
console.log(height);

var svg = d3.select("#chart")
    .append("svg")
    .attr("width", width)
    .attr("height", height);


var promises = [
    d3.json("./data/wearlog.json"), 
    d3.csv("./data/wearlog.csv", parse)
];

Promise.all(promises).then(function(data) {
    jsonData = data[0];
    csvData = data[1];

    console.log(csvData)
    let colors = [];
    for(let i = 0; i < csvData.length; i++) {
        colors.push(csvData[i].hex1)
        colors.push(csvData[i].hex2)
        colors.push(csvData[i].hex3)
        colors.push(csvData[i].hex4)
        colors.push(csvData[i].hex5)
    }

    

    let nested = d3.nest()
        .key(function(d) { return d})
        .rollup(function(v) { return v.length;})
        .entries(colors)

    nested.forEach((d) =>
        d.hsl = HEXtoHSL(d.key)
    )
    
    console.log(nested)

    const hueScale = d3.scaleLinear()
        .domain([0,360])
        .range([margin.left, width-margin.right])

    const satScale = d3.scaleLinear()
        .domain([0,100])
        .range([height-margin.bottom, margin.top])

    const yScale = d3.scaleLinear()
        .domain([0,2000])
        .range([height-margin.bottom, margin.top])

    let histogramValues = d3.histogram()
        .value(function(d) {return d.hsl.h})
        .domain(hueScale.domain())
        .thresholds(hueScale.ticks(45))

    let bins = histogramValues(nested);
    
    nested.forEach((g) => {
        bins.forEach((bin) => {
            bin.sort((a,b) => d3.ascending(a.hsl.l, b.hsl.l))
            bin.forEach((d,i) => {
                d.xPos = bin.x0;
                // d.yPos = i*20;
                d.yPos = ((i) * d.value);
            })
            if(bin.key === g.key) {
                g.push({xPos: bin.xPos, yPos: bin.yPos})
            }
        })
    })
    

    console.log(nested)

    svg.selectAll("rect")
        .data(nested)
        .enter()
        .append("rect")
        .attr("x", d => hueScale(d.xPos))
        .attr("width", 30)
        .attr("y", d => yScale(d.yPos))
        .attr("height", 10)
        .attr("fill", (d) => d.key)
    
    
});

function parse(d) {

    return {
        date: new Date(d.date),
        description: (d.Brand + " ").concat((d.Description + " ")).concat(d.Sub_Category),
        id: +d.garmentId,
        group: d.group,
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