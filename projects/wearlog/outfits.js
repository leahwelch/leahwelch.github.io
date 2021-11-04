var promises = [
    d3.json("./data/wearlog.json"), 
    d3.csv("./data/wearlog.csv", parse)
];

var width = document.querySelector("#chart").clientWidth;
var height = document.querySelector("#chart").clientHeight;
var margin = {top: 20, left: 250, right: 250, bottom: 20};

var svg = d3.select("#chart")
    .append("svg")
    .attr("width", width)
    .attr("height", height);


Promise.all(promises).then(function(data) {
    jsonData = data[0];
    csvData = data[1];



    // jsonData.weeks.forEach(function(d,i) {
    //     d[i].days.forEach(function(p,j) {
    //         p[j].outfit.forEach(function(n,o) {
    //             console.log(n[o].date)
    //             // d[i].date = new Date(n[o].date);
    //         })
    //     })
    // })
    let week = jsonData.weeks[0].days.concat(jsonData.weeks[1].days)
        .concat(jsonData.weeks[2].days)
        .concat(jsonData.weeks[3].days)
        .concat(jsonData.weeks[4].days)
    console.log(week)

    let weekColors = [];
    week.forEach(function(d) {
        d.outfit.forEach(function(p) {
            weekColors.push({date: new Date(p.date), colors: [p.hex1, p.hex2, p.hex3, p.hex4, p.hex5]})
            // console.log(new Date(p.date))
        })
    })
    

    let nestedColors = d3.nest()
        .key(d=>d.date)
        .rollup()
        .entries(weekColors)

    nestedColors.forEach(function(d) {
        d.key = new Date(d.key)
        let colors = [];
        let hslColors = [];
        let hues = [];
        d.values.forEach(function(p) {
            p.colors.forEach(function(n) {
                colors.push(n)
            })
        })
        d.colors = colors;
        colors.forEach(function(m) {
            hslColors.push({hsl: HEXtoHSL(m), hex: m})
            hues.push(HEXtoHSL(m).h)
        })
        d.hsl = hslColors.sort((a,b)=>d3.ascending(a.hsl.h,b.hsl.h));  
        d.hue = hues; 
                            
    })
    console.log(nestedColors)

    let colorData = [];
    for(let i = 0; i < nestedColors.length; i++) {
        let date = nestedColors[i].key;
        for(let j = 0; j < nestedColors[i].colors.length; j++) {
            colorData.push({date: date, hex: nestedColors[i].hsl[j].hex, xpos: j+1})
        }
    }
    console.log(colorData)

    let items = [];
    for(let i = 0; i < csvData.length; i++) {
        let ids = [csvData[i].id];
        ids.forEach(function(val) {
            if(items.indexOf(val) < 0) {
                items.push(val);
            }
        }
        )
    }
    
    
    let outfits = [];
    for(let i = 0; i < jsonData.weeks.length; i++) {
        let week = jsonData.weeks[i];
        for(let j = 0; j < week.days.length; j++) {
            let outfit = week.days[j]
            outfits.push(outfit);
        }
    }

    console.log(outfits)

    // outfits.forEach(function(d,i) {
    //     let arr = [];
    //     let outfit = outfits[i].outfit;
    //     outfit.forEach(function(v,j){
    //         arr.push(outfit[j].garmentId)
    //     })
    //     d.idSet = arr;
    // })
    console.log(outfits)

    var nested = d3.nest()
        .key(function(d) { return d.idSet; })
        .rollup()
        .entries(outfits)
    nested.sort(function(a,b) {return d3.descending(a.values.length, b.values.length)})
    console.log(nested)

    const yScale = d3.scaleTime()
        .domain([new Date("2020-10-05"), new Date("2020-11-05")])
        .range([margin.top,height-margin.bottom])

    const xScale = d3.scaleLinear()
        .domain([0,120])
        .range([margin.left, width-margin.right])

    // const hueScale = d3.scaleBand()
    //     .domain(nested.map(function(d) { return d.key; }))
    //     .range([margin.left, width-margin.right])
    //     .padding(1);
    svg.selectAll("rect")
        .data(colorData)
        .enter()
        .append("rect")
        .attr("x", d => xScale(d.xpos))
        .attr("width", 10)
        .attr("y", d => yScale(d.date))
        .attr("height", 20)
        .attr("fill", (d) => d.hex)

});

function parse(d) {

    return {
        date: new Date(d.date),
        description: (d.Brand + " ").concat((d.Description + " ")).concat(d.Sub_Category),
        id: +d.garmentId,
        group: d.group
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

function removeDuplicates(originalData, prop) {
    var newData = [];
    var lookupObject = {};

    for(var i in originalData) {
        lookupObject[originalData[i][prop]] = originalData[i];
     }

     for(i in lookupObject) {
         newData.push(lookupObject[i]);
     }
      return newData;

}