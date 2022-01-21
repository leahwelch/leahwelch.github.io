

var width = document.querySelector("#chart").clientWidth;
var height = document.querySelector("#chart").clientHeight;
var margin = {top: 250, left: 250, right: 250, bottom: 350};

var svg = d3.select("#chart")
    .append("svg")
    .attr("width", width)
    .attr("height", height);


d3.csv("./data/wearlog.csv", parse).then(function(data) {

    
    data.forEach(function(d) {
        if(d.brand === '') {
            d.brand = 'Vintage';
        }
    })
    console.log(data)
    var nested = d3.nest()
        .key(function(d) { return d.brand; })
        .key(function(d) { return d.id; })
        .rollup(function(v) { return v.length;})
        .entries(data);

    nested.forEach(function(d) {
        d.itemCount = d.values.length;
        let wearCount;
        wearCount = d3.sum(d.values, g=>g.value)
        d.wearCount = wearCount;
    })
    console.log(nested)
    

    // nested.forEach(function(d) {
    //     d.itemTotal = d.values.length;
    //     let wearCount;
    //     let items = d.values;
    //     items.forEach(function(g) {
    //         console.log(g.values.length)
    //         wearCount = d3.sum(items => g.values.length)
    //     })
    //     d.wearCount = wearCount;
        
    // })

    console.log(nested)

    var xScale = d3.scaleLinear()
        .range([margin.left, width-margin.right])
        .domain([0,280])

    let histogramValues = d3.histogram()
        .value(function(d) {return d.value})
        .domain(xScale.domain())
        .thresholds(xScale.ticks(140))

    let bins = histogramValues(nested);
    console.log(bins)
    

    // var yScale = d3.scalePoint()
    //     .range([height-margin.bottom, margin.top])
    //     .domain(d3.extent(bins, function(d) {
    //         return +d["x0"];
    //     }))
    const rScale = d3.scaleSqrt()
        .domain(d3.extent(nested, d=>+d["itemCount"]))
        .range([3,30])

    let simulation = d3.forceSimulation(nested)
        .force("x", d3.forceX(function(d) {
            return xScale(d.wearCount);
        }).strength(0.1))
        .force("y", d3.forceY((height/2) - margin.bottom/2).strength(0.1))
        // .force("y", d3.forceY((d) => {
        //     return yScale(+d["x0"])
        // }).strength(1))
        .force("collide", d3.forceCollide((d)=> rScale(d["itemCount"]+0.5)))

    for(let i = 0; i < nested.length; i++) {
        simulation.tick(10);
    }

    let nodes = svg.selectAll(".nodes")
        .data(nested, function(d) { return d.key });

    nodes.exit()
        .transition()
        .duration(1000)
        .attr("cx", 0)
        .attr("cy", (height/2) - margin.bottom/2)
        .remove();

    nodes.enter()
        .append("circle")
        .attr("class", "nodes")
        .attr("cx", 0)
        .attr("cy", (height/2) - margin.bottom/2)
        .attr("r", d=>rScale(d.itemCount))
        // .attr("fill", function(d) { return d.hex1; })
        .merge(nodes)
        .transition()
        .duration(2000)
        .attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; })

    // var xAxis = svg.append("g")
    //     .attr("class", "axis")
    //     .attr("transform", `translate(0, ${height-margin.bottom})`)
    //     .call(d3.axisBottom().scale(xScale));

    
        

   
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