// set the dimensions and margins of the graph
const width = 950,
    height = 650,
    margin = 150;

// The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
const radius = Math.min(width, height) / 2 - margin

// append the svg object to the div called 'my_dataviz'
const svg = d3.select("#chart")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", `translate(${width / 2},${height / 2})`);

const promises = [
    d3.csv("./data/partner_data.csv", parse)
];

Promise.all(promises).then(function (data) {

    let filtered = data[0].filter(d => d.city === "Boulder")
    console.log(data)
    let boulder_by_category = d3.groups(filtered, d => d.category)

    console.log(boulder_by_category)

    // set the color scale
    const color = d3.scaleOrdinal()
        .domain(boulder_by_category.map(d => d[0]))
        .range(["#cdfee3", "#25E297", "#00C980", "#00A469", "#006747", "#00553B"]);

    // Compute the position of each group on the pie:
    const pie = d3.pie()
        .sort(null) // Do not sort group by size
        .value(d => d[1].length)

    const data_ready = pie(boulder_by_category)
    console.log(data_ready)

    let rScale = d3.scaleLinear()
        .domain([d3.min(boulder_by_category, d => d[1].length), d3.max(boulder_by_category, d => d[1].length)])
        .range([radius * 0.6, radius])

    // The arc generator
    const arc = d3.arc()
        .innerRadius(radius * 0.4)         // This is the size of the donut hole
        .outerRadius(d => rScale(d.data[1].length))

    // Another arc that won't be drawn. Just for labels positioning
    const outerArc = d3.arc()
        .innerRadius(radius * 0.9)
        .outerRadius(radius * 0.9)


    // Add the polylines between chart and labels:
    svg
        .selectAll('allPolylines')
        .data(data_ready)
        .join('polyline')
        .attr("stroke", "white")
        .style("fill", "none")
        .attr("stroke-width", 1)
        .attr('points', function (d) {
            const posA = arc.centroid(d) // line insertion in the slice
            const posB = outerArc.centroid(d) // line break: we use the other arc generator that has been built only for that
            const posC = outerArc.centroid(d); // Label position = almost the same as posB
            const midangle = d.startAngle + (d.endAngle - d.startAngle) / 2 // we need the angle to see if the X position will be at the extreme right or extreme left
            posC[0] = radius * 0.95 * (midangle < Math.PI ? 1 : -1); // multiply by 1 or -1 to put it on the right or on the left
            return [posA, posB, posC]
        })
        .attr("opacity", 0.4)

    // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
    svg
        .selectAll('allSlices')
        .data(data_ready)
        .join('path')
        .attr('d', arc)
        .attr('fill', d => color(d.data[0]))
        .attr("stroke", "none")

    // Add the polylines between chart and labels:
    svg
        .selectAll('.category_label')
        .data(data_ready)
        .join('text')
        .text(d => d.data[0])
        .attr('transform', function (d) {
            const pos = outerArc.centroid(d);
            const midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
            pos[0] = radius * 0.99 * (midangle < Math.PI ? 1 : -1);
            return `translate(${pos})`;
        })
        .attr("class", "category_label")
        .style('text-anchor', function (d) {
            const midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
            return (midangle < Math.PI ? 'start' : 'end')
        })
        .attr("dominant-baseline", "middle")
        .attr("fill", "white")

    svg
        .selectAll('.value_label')
        .data(data_ready)
        .join('text')
        .text(d => d.data[1].length)
        .attr('transform', function (d) {
            const pos = outerArc.centroid(d);
            const midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
            pos[0] = radius * 0.99 * (midangle < Math.PI ? 1 : -1);
            pos[1] = pos[1] + 15
            return `translate(${pos})`;
        })
        .attr("class", "value_label")
        .style('text-anchor', function (d) {
            const midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
            return (midangle < Math.PI ? 'start' : 'end')
        })
        .attr("dominant-baseline", "middle")
        .attr("fill", "white")

});

function parse(d) {
    return {
        partner: d.PARTNER,
        church: d.CHURCH,
        category: d.MINISTRY_CATEGORY,
        city: d.CITY,
        state: d.STATE,
        zip: +d.ZIP_CODE,
        lat: +d.LAT,
        lon: +d.LNG
    }
}