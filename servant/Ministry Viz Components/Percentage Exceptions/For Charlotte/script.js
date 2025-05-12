// set the dimensions and margins of the graph
const width = 500,
    height = 500,
    margin = 20;

// The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
const radius = Math.min(width, height) / 2 - margin

// append the svg object to the div called 'my_dataviz'
const svg = d3.select("#chart")
    .append("svg")
    .attr("width", width)
    .attr("height", height)

const promises = [
    d3.json("./data/metrics.json")
];

Promise.all(promises).then(function (data) {
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

    const selected_data = percent_only.filter(d => d.company_name === "For Charlotte")
    for (let i = 0; i < selected_data.length; i++) {
        if (i === 0) {
            selected_data[i].year = '2015'
        } else {
            selected_data[i].year = '2025'
        }
    }
    console.log(selected_data)

    let yScale = d3.scaleLinear()
        .domain([0, 100])
        .range([height - margin, margin])

    svg.append("rect")
        .attr("class", "base_rect")
        .attr("x", width / 4)
        .attr("y", yScale(100))
        .attr("width", width / 2)
        .attr("height", height - margin - yScale(100))
        .attr('fill', "#4d4d4d")

    svg.append("rect")
        .attr("class", "top_rect")
        .attr("x", width / 4)
        .attr("y", yScale(selected_data[0].metric_value))
        .attr("width", width / 2)
        .attr("height", height - margin - yScale(selected_data[0].metric_value))
        .attr('fill', "#00c980")
        .transition()
        .duration(1000)
        .attr("y", yScale(selected_data[1].metric_value))
        .attr("height", height - margin - yScale(selected_data[1].metric_value))

    let label = svg.append("text")
        .attr("class", "year_label")
        .attr("x", width * .75 + 10)
        .attr("y", yScale(selected_data[0].metric_value))
        .attr("dominant-baseline", "middle")
        .attr("fill", "white")
        .text("2015")
    label.transition()
        .tween("text", function () {
            var selection = d3.select(this);    // selection of node being transitioned
            var start = d3.select(this).text(); // start value prior to transition
            var end = 2025;                     // specified end value
            var interpolator = d3.interpolateNumber(start, end); // d3 interpolator

            return function (t) { selection.text(Math.round(interpolator(t))); };  // return value

        })
        .duration(1000)
        .attr("y", yScale(selected_data[1].metric_value))

    let percent_label = svg.append("text")
        .attr("class", "percent_label")
        .attr("x", width / 2)
        .attr("y", yScale(selected_data[0].metric_value) - 10)
        .attr("text-anchor", "middle")
        .attr("fill", "white")
        .text(selected_data[0].metric_value + "%")
    percent_label.transition()
        .tween("text", function () {
            var selection = d3.select(this);    // selection of node being transitioned
            var start = selected_data[0].metric_value; // start value prior to transition
            var end = selected_data[1].metric_value;                     // specified end value
            var interpolator = d3.interpolateNumber(start, end); // d3 interpolator

            return function (t) { selection.text(Math.round(interpolator(t)) + "%"); };  // return value

        })
        .duration(1000)
        .attr("y", yScale(selected_data[1].metric_value) - 10)

    //ANIMATED NUMBER COUNTER
    let startNumber = selected_data[0].metric_value;
    let endNumber = selected_data[1].metric_value;

    d3.select("#bar_header")
        .transition()
        .duration(1000)
        .tween("number", function () {
            let interpolate = d3.interpolateRound(startNumber, endNumber);
            return function (t) {
                d3.select(this).html("<span>" + selected_data[1].metric_description.slice(0, -1) + ": </span><h3>" + d3.format(",")(interpolate(t)) + "%</h3>")
            };
        });


});
