//Setting up the SVG where we'll be appending everything for our chart
const width = document.querySelector("#chart").clientWidth;
const height = document.querySelector("#chart").clientHeight;
const margin = { top: 50, left: 250, right: 150, bottom: 150 };

const svg = d3.select("#chart")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

d3.csv("./data/2018-boston-crimes.csv", parse).then(function (data) {
    let groupNest = d3.nest()
        .key(d => d.group)
        .rollup()
        .entries(data)
        .sort((a, b) => b.values.length - a.values.length);
    groupNest = groupNest.slice(0, 20);
    console.log(groupNest)
    let heatmapData = [];
    groupNest.forEach((d) => {
        let hourNest = d3.nest()
            .key(p => p.hour)
            .rollup(v => v.length)
            .entries(d.values)
        hourNest.forEach(p => p.key = +p.key)
        hourNest.sort((a, b) => a.key - b.key);
        for (let i = 0; i < hourNest.length; i++) {
            heatmapData.push({
                group: d.key,
                hour: hourNest[i].key,
                value: hourNest[i].value
            })
        }
    })

    //scales: we'll use a band scale for the bars
    const xScale = d3.scaleBand()
        .domain(heatmapData.map(d => d.hour))
        .range([margin.left, width - margin.right])
        .padding(0.01);

    const yScale = d3.scaleBand()
        .domain(heatmapData.map(d => d.group))
        .range([margin.top, height - margin.bottom])
        .padding(0.01);

    const colorScale = d3.scaleSequential()
        .interpolator(d3.interpolateBlues)
        .domain(d3.extent(heatmapData, (d) => {
            return +d["value"];
        }))

    const bar = svg.selectAll("rect")
        .data(heatmapData)
        .enter()
        .append("rect")
        .attr("x", d => xScale(d.hour))
        .attr("y", d => yScale(d.group))
        .attr("width", xScale.bandwidth())
        .attr("height", yScale.bandwidth())
        .attr("fill", d => colorScale(d.value));

    const xAxis = svg.append("g")
        .attr("class", "axis")
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom().scale(xScale));

    const yAxis = svg.append("g")
        .attr("class", "axis")
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft().scale(yScale));


});

//get the data in the right format
function parse(d) {
    return {
        group: d.OFFENSE_CODE_GROUP,
        hour: +d.HOUR,
    }
}

