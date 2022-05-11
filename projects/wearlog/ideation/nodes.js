

var width = document.querySelector("#chart").clientWidth;
var height = document.querySelector("#chart").clientHeight;
var margin = {top: 0, left: 50, right: 50, bottom: 0};

var svg = d3.select("#chart")
    .append("svg")
    .attr("width", width)
    .attr("height", height);


d3.csv("./data/wearlog.csv", parse).then(function(data) {

    // var nested = d3.nest()
    //     .key(function(d) { return d.id; })
    //     .rollup(function(v) { return v.length;})
    //     // .rollup()
    //     .entries(data);

    // console.log(nested)

    // nested.forEach(function(d) {
    //     data.forEach(function(g) {
    //         if(g.id == d.key) {
    //             d.hex1 = g.hex1;
    //         }
    //     })
    // })

    // console.log(nested)

    let colors = [];
    for(let i = 0; i < data.length; i++) {
        colors.push({color: data[i].hex1, date: data[i].date, id: data[i].id, description: data[i].description})
        colors.push({color: data[i].hex2, date: data[i].date, id: data[i].id, description: data[i].description})
        colors.push({color: data[i].hex3, date: data[i].date, id: data[i].id, description: data[i].description})
        colors.push({color: data[i].hex4, date: data[i].date, id: data[i].id, description: data[i].description})
        colors.push({color: data[i].hex5, date: data[i].date, id: data[i].id, description: data[i].description})
    }

    let nested = d3.nest()
        .key(function(d) { return d.color})
        .rollup(function(v) { return v.length;})
        .entries(colors)

    nested.forEach((d) => {
        d.hsl = HEXtoHSL(d.key)
        d.hue = d.hsl.h
    })

    colors.forEach((d) => {
        d.hsl = HEXtoHSL(d.color)
        d.hue = d.hsl.h
    })

    nested.sort((a,b) => d3.ascending(a.hue,b.hue))
    colors.sort((a,b) => d3.ascending(a.hue,b.hue))
    

    const hueScale = d3.scaleLinear()
        .domain([0,360])
        .range([margin.left, width-margin.right])

    let histogramValues = d3.histogram()
        .value(function(d) {return d.hue})
        .domain(hueScale.domain())
        .thresholds(hueScale.ticks(24))

    let bins = histogramValues(nested);
    let beeBins = histogramValues(colors)
    console.log(beeBins)
    console.log(bins)
    
    nested.forEach((g) => {
        bins.forEach((bin) => {
            bin.forEach((d,i) => {
                d.bucket = bin.x0;
            })
            // console.log(bin)
            if(bin.key === g.key) {
                nested.push({bucket: bin.x0})
            }
        })
    })
    

    colors.forEach((g) => {
        beeBins.forEach((bin) => {
            bin.forEach((d,i) => {
                d.bucket = bin.x0;
            })
            // console.log(bin)
            if(bin.date === g.date) {
                colors.push({bucket: bin.x0})
            }
        })
    })
    console.log(colors)

    var xScale = d3.scaleTime()
        .range([margin.left, width-margin.right])
        .domain([new Date("2020-10-01"), new Date("2021-12-01")])

    var yScale = d3.scaleLinear()
        .range([height-margin.bottom, margin.top])
        .domain(d3.extent(colors, function(d) {
            return +d["bucket"];
        }))

    // svg.selectAll("rect")
    //     .data(colors)
    //     .enter()
    //     .append("rect")
    //     .attr("x", function(d) { return xScale(d.date); })
    //     .attr("y", function(d) { return yScale(d.bucket); })
    //     //.attr("cy", height/2)
    //     .attr("width", 2)
    //     .attr("height", 25)
    //     .attr("fill", d=>d.color)

    svg.selectAll("circle")
        .data(colors)
        .enter()
        .append("circle")
        .attr("cx", function(d) { return xScale(d.date); })
        .attr("cy", function(d) { return yScale(d.bucket) + ((Math.random()-0.5)*50); })
        //.attr("cy", height/2)
        .attr("r", 4)
        .attr("fill", d=>d.color)

    

    var xAxis = svg.append("g")
        .attr("class", "axis")
        .attr("transform", `translate(0, ${height-margin.bottom})`)
        .call(d3.axisBottom().scale(xScale));

    
        

   
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