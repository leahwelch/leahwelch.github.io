const promises = [
    d3.json("./data/metrics.json"),
    d3.csv("./data/counter_icons.csv")
];

Promise.all(promises).then(function (data) {
    console.log(data[0].companies)
    console.log(data[1])
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
    console.log(all_metrics)

    let by_component = d3.groups(all_metrics, d => d.recommended_visualization_component)
    console.log(by_component)

    let counter_only = by_component.filter(d => d[0] === "counter")[0][1]
    let by_unit = d3.groups(counter_only, d => d.metric_unit)
    console.log(by_unit)

    for (let i = 0; i < counter_only.length; i++) {
        for (let j = 0; j < data[1].length; j++) {
            if (counter_only[i].metric_unit === data[1][j].metric_unit) {
                counter_only[i].icon = data[1][j].icon
            }
        }
    }
    console.log(counter_only)

    //set thresholds so very large values don't return gigantic waffle charts
    const boxScale = d3.scaleThreshold([500, 5000, 500000, 5000000, 50000000, 500000000], [10, 100, 1000, 10000, 100000, 1000000]);
    let max = 500;

    function set_box_count(val) {
        return val <= max ? val : Math.round(val / boxScale(val))
    }

    const waffle = d3.select('.waffle');

    //pulling a random record from the JSON for the sake of testing
    const selected_data = counter_only[23]

    const numbers = d3.range(set_box_count(selected_data.metric_value))
    console.log(counter_only[62])

    let icons = waffle.selectAll('.ph').data(numbers)

    icons.enter()
        .append('i')
        .attr("class", `ph ph-${selected_data.icon}`)
        .style("opacity", 0)
        .merge(icons)
        .transition()
        .delay(function (p, i) { return 20 * i; })
        .style("opacity", 1)

    let label_container = d3.select("#label_container")

    label_container.append('i')
        .attr("class", `ph ph-${selected_data.icon}`)
        .attr("id", "label_block")

    label_container.append('div')
        .attr("id", "label_text")
        .html(" = " + d3.format(",")(selected_data.metric_value <= max ? 1 : boxScale(selected_data.metric_value)) + " " + selected_data.metric_label)

    //ANIMATED NUMBER COUNTER
    let startNumber = 0;
    let endNumber = selected_data.metric_value;

    d3.select("#waffle_header")
        .transition()
        .duration(2500) 
        .tween("number", function () {
            let interpolate = d3.interpolateRound(startNumber, endNumber);
            return function (t) {
                d3.select(this).text(d3.format(",")(interpolate(t)) + " " + selected_data.metric_label);
            };
        });

});
