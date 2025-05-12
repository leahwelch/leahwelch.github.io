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

    let xScale = d3.scaleBand()
        .domain(selected_data.map(d => d.year))
        .range([margin, width - margin])
        .padding(0.1)

    let yScale = d3.scaleLinear()
        .domain([0, 100])
        .range([height - margin, margin])

    svg.selectAll(".base_rect")
        .data(selected_data)
        .enter()
        .append("rect")
        .attr("class", "base_rect")
        .attr("x", d => xScale(d.year))
        .attr("y", yScale(100))
        .attr("width", xScale.bandwidth())
        .attr("height", height - margin - yScale(100))
        .attr('fill', "#4d4d4d")

    svg.selectAll(".top_rect")
        .data(selected_data)
        .enter()
        .append("rect")
        .attr("class", "base_rect")
        .attr("x", d => xScale(d.year))
        .attr("width", xScale.bandwidth())
        .attr("y", (d) => {
            if (d.year === '2025') {
                return height - margin
            } else {
                return yScale(d.metric_value)
            }
        })
        .attr("height", (d) => {
            if (d.year === '2025') {
                return 0
            } else {
                return height - margin - yScale(d.metric_value)
            }
        })
        .transition()
        .duration(1000)
        .attr("y", d => yScale(d.metric_value))
        .attr("height", d => height - margin - yScale(d.metric_value))
        .attr('fill', "#00c980")

    const xAxis = svg.append("g")
        .attr("class", "axis")
        .attr("transform", `translate(0, ${height - margin})`)
        .call(d3.axisBottom().scale(xScale))

    svg.selectAll(".percent_label")
        .data(selected_data)
        .enter()
        .append("text")
        .attr("class", "percent_label")
        .attr("x", d => xScale(d.year) + xScale.bandwidth() / 2)
        .attr("text-anchor", "middle")
        .attr("fill", "white")
        .attr("y", (d) => {
            if (d.year === '2025') {
                return height - margin - 10
            } else {
                return yScale(d.metric_value) - 10
            }
        })
        .text(d => d.metric_value + "%")
        .transition()
        .duration(1000)
        .attr("y", d => yScale(d.metric_value) - 10)



    //ANIMATED NUMBER COUNTER
    let startNumber = 0;
    let endNumber = selected_data[1].metric_value;

    d3.select("#bar_header")
        .transition()
        .duration(1000)
        .tween("number", function () {
            let interpolate = d3.interpolateRound(startNumber, endNumber);
            return function (t) {
                d3.select(this).text(selected_data[1].metric_description.slice(0, -1) + ": " + d3.format(",")(interpolate(t)) + "%")
            };
        });


});
