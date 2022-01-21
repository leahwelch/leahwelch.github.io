

var width = document.querySelector("#chart").clientWidth;
var height = document.querySelector("#chart").clientHeight;
var margin = {top: 50, left: 50, right: 50, bottom: 50};

var svg = d3.select("#chart")
    .append("svg")
    .attr("width", width)
    .attr("height", height);


d3.csv("./data/wearlog.csv", parse).then(function(data) {


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
            if(bin.date === g.date) {
                colors.push({bucket: bin.x0})
            }
        })
    })
    console.log(colors)

    // let filtered = colors.filter(d => d.bucket === 20)
    let filtered = colors.filter(d => d.date > new Date("2021-10-02") && d.date < new Date("2021-10-03"))
    

    let filterNest = d3.nest()
        .key(d=>d.id)
        .rollup()
        .entries(filtered)

    console.log(filterNest)

    let stackData = [];
    filterNest.forEach((d,i) => {
        d.values.forEach((p) => {
            stackData.push({
                ypos: i,
                color: p.color,
                date: p.date
            })
        })
    })
    console.log(stackData)

    let filteredData = []
    for(let i = 0; i < filterNest.length; i++) {
        for(let j = 0; j < colors.length; j++) {
            if(+filterNest[i].key === colors[j].id) {
                filteredData.push({
                    id: colors[j].id,
                    description: colors[j].description,
                    color: colors[j].color,
                    date: colors[j].date,
                    ypos: j
                })
            }
        }
    }
    console.log(filteredData)

    const xScale = d3.scaleTime()
        .range([margin.left, width-margin.right])
        .domain([new Date("2020-10-01"), new Date("2021-12-01")])

    const yScale = d3.scaleLinear()
        .domain([-5, 45])
        .range([height-margin.bottom, margin.top])



    // var yScale = d3.scalePoint()
    //     .domain(filteredData.map(function(d) { return d.id; }))
    //     .range([margin.top, height-margin.bottom])
    //     .padding(10)

    // svg.selectAll("circle")
    //     .data(filteredData)
    //     .enter()
    //     .append("circle")
    //     .attr("cx", function(d) { return xScale(d.date) + ((Math.random()-0.5)*15); })
    //     .attr("cy", function(d) { return yScale(d.id) + ((Math.random()-0.5)*15); })
    //     .attr("r", 4)
    //     .attr("fill", d=>d.color)

     svg.selectAll("circle")
        .data(stackData)
        .enter()
        .append("circle")
        .attr("cx", function(d) { return xScale(d.date) + ((Math.random()-0.5)*25); })
        .attr("cy", function(d) { return yScale(d.ypos) + ((Math.random()-0.5)*25); })
        .attr("r", 8)
        .attr("fill", d=>d.color)

    

    var xAxis = svg.append("g")
        .attr("class", "axis")
        .attr("transform", `translate(0, ${height-margin.bottom})`)
        .call(d3.axisBottom().scale(xScale));

    var yAxis = svg.append("g")
        .attr("class","axis")
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft().scale(yScale));

    
        

   
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