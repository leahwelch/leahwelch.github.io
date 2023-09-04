const width = document.querySelector("#chart").clientWidth;
const height = document.querySelector("#chart").clientHeight;

const margin = {
    top: 100,
    right: 100,
    bottom: 150,
    left: 150
}

const svg = d3.select("#chart")
    .append("svg")
    .attr("width", width)
    .attr("height", height)

function showVis(event) {
    let i, tablinks;
    tablinks = document.getElementsByClassName("tablinks");
    for(let i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "")
    }
    event.currentTarget.className += " active";
}

d3.csv("./data/timeline.csv", parse).then(function(data) {
    console.log(data)
    let yScale = d3.scalePoint()
        .domain(data.map(d => d.invoice))
        .range([height-margin.bottom, margin.top])
        .padding(0.1)

    let xScale = d3.scaleTime()
        .domain([new Date("2023-09-01"), new Date("2023-09-25")])
        .range([margin.left,width-margin.right])

    let grouping = svg.selectAll(".grouping")
        .data(data)
        .enter()
        .append("g")
        .attr("class", "grouping")
        .attr("transform", (d) => `translate(0, ${yScale(d.invoice)})`)

    grouping.append("line")
        .attr("x1", d => xScale(d.ordered))
        .attr("x2", d => xScale(d.shipped))
        .attr("stroke", "black")

    grouping.append("circle")
        .attr("cx", d => xScale(d.ordered))
        .attr("r", 5)
        .attr("stroke", "black")
        .attr("fill", "white")

    grouping.append("circle")
        .attr("cx", d => xScale(d.shipped))
        .attr("r", 5)
        .attr("stroke", "black")
        .attr("fill", "#a7a7a7")


    //color-code by warehouse?
    //sort by order date
    //sort by ship date
    //sort by delivery date
    //group by warehouse
    //sort by shipment time - normalize order date
    //sort total fulfillment time - align middle at ship date
})

function parse(d) {
    return {
        warehouse : d.warehouse,
        ordered: new Date(d.ordered),
        shipped: new Date(d.shipped),
        delivered: new Date(d.delivered),
        invoice: d.invoice
    }
}