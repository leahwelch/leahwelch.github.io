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
    console.log(all_metrics)

    let by_component = d3.groups(all_metrics, d => d.recommended_visualization_component)
    console.log(by_component)

    let currency_only = by_component.filter(d => d[0] === "currency")[0][1]
    console.log(currency_only)

    let selected_data = currency_only[1]
    console.log(selected_data)
   
    //ANIMATED NUMBER COUNTER
    let startNumber = 0;
    let endNumber = selected_data.metric_value;

    d3.select("#header")
        .transition()
        .duration(2000) 
        .tween("number", function () {
            let interpolate = d3.interpolateRound(startNumber, endNumber);
            return function (t) {
                d3.select(this).html(
                    "<h3>$" + 
                    d3.format(",")(interpolate(t)) + 
                    "</h3><span> in " + selected_data.metric_label + "</span>"
                );
            };
        });

});
