// set the dimensions and margins of the graph
const width = 500,
    height = 500,
    margin = 10;

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
    d3.json("./data/metrics.json")
];

Promise.all(promises).then(function (data) {
    console.log(data[0].companies)
    let all_metrics = []
    for (let i = 0; i < data[0].companies.length; i++) {
        for (let j = 0; j < data[0].companies[i].metrics.length; j++) {
            all_metrics.push({
                company_name: data[0].companies[i].company_name,
                metric_description: data[0].companies[i].metrics[j].metric_description,
                metric_label: data[0].companies[i].metrics[j].metric_label,
                metric_unit: data[0].companies[i].metrics[j].metric_unit,
                metric_value: data[0].companies[i].metrics[j].metric_value,
                recommended_visualization_component: data[0].companies[i].metrics[j].recommended_visualization_component
            })
        }
    }

    let by_component = d3.groups(all_metrics, d => d.recommended_visualization_component)

    let percent_only = by_component.filter(d => d[0] === "percentage")[0][1]

    console.log(percent_only)

    const selected_data = percent_only[2]
    console.log(selected_data)

    let chart_data = {
        this: selected_data.metric_value,
        other: 100 - selected_data.metric_value
    }

    const color = d3.scaleOrdinal()
        .domain(["this", "other"])
        .range(["#00c980", "#4d4d4d"]);

    console.log(chart_data)

    const pie = d3.pie()
        .sort(null) // Do not sort group by size
        .value(d => d[1])
    const data_ready = pie(Object.entries(chart_data))
    console.log(data_ready)

    // The arc generator
    const arc = d3.arc()
        .innerRadius(radius * 0.5)         // This is the size of the donut hole
        .outerRadius(radius * 0.8)

    // Another arc that won't be drawn. Just for labels positioning
    const outerArc = d3.arc()
        .innerRadius(radius * 0.9)
        .outerRadius(radius * 0.9)

    // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
    svg
        .selectAll('background_donut')
        .data(data_ready)
        .join('path')
        .attr('d', arc)
        .attr('fill', "#4d4d4d")
        // .attr("stroke", "black")
        // .style("stroke-width", "3px")


    svg
        .selectAll('allSlices')
        .data(data_ready)
        .join('path')
        .attr('d', arc)
        .attr('fill', d => color(d.data[1]))
        .attr("opacity", (d) => {
            if(d.data[0] === "this") {
                return 1;
            } else {
                return 0;
            }
        })
        // .attr("stroke", "black")
        // .style("stroke-width", "3px")
        .transition()
        .delay(function (d, i) { return i * 500; })
        .duration(1000)
        .attrTween('d', function (d) {
            var i = d3.interpolate(d.startAngle + 0.1, d.endAngle);
            return function (t) {
                d.endAngle = i(t);
                return arc(d);
            }
        });

    //ANIMATED NUMBER COUNTER
    let startNumber = 0;
    let endNumber = selected_data.metric_value;

    d3.select("#donut_header")
        .transition()
        .duration(1000)
        .tween("number", function () {
            let interpolate = d3.interpolateRound(startNumber, endNumber);
            return function (t) {
                d3.select(this).text(d3.format(",")(interpolate(t)) + "% " + selected_data.metric_label);
            };
        });


});
