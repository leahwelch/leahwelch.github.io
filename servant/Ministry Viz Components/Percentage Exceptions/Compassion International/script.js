// set the dimensions and margins of the graph
const width = 500,
    height = 500,
    margin = 20;

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

    const selected_data = percent_only.filter(d => d.company_name === "Compassion International, Inc.")
    console.log(selected_data)

    d3.select("#header")
        .html("<h3>" + selected_data[0].metric_value + "%</h3><span>" + selected_data[0].metric_label + "</span>")

    d3.select("#description")
        .html(selected_data[0].metric_description)




});
