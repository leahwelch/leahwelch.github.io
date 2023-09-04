var width = document.querySelector("#chart").clientWidth;
var height = document.querySelector("#chart").clientHeight;
var margin = { top: 50, left: 50, right: 50, bottom: 50 };

var svg = d3.select("#chart")
    .append("svg")
    .attr("width", width)
    .attr("height", height);


d3.csv("./data/wearlog.csv", parse).then(function (data) {
    console.log(data)
    
    //filter data to only show new items
    let filtered = data.filter(d => d.new === "Y")
    console.log(filtered)

    //nest data by item
    let nested = d3.nest()
        .key(d => d.id)
        .rollup()
        .entries(filtered)
    console.log(nested)
    
    //use the first wear date to group items by where I was living
    nested.forEach((d) => {
        let first_wear = d.values[0];
        d.first_wear = first_wear;
        if(d.first_wear.date < new Date("2021-06-25")) {
            d.location = "Lawrence";
        } else if(d.first_wear.date >= new Date("2021-06-25") && d.first_wear.date < new Date("2022-07-01")) {
            d.location = "Portsmouth";
        } else {
            d.location = "Somerville";
        }
    })

    //set xScale
    let xScale = d3.scaleTime()
        .domain([new Date("2020-10-05"), new Date("2023-02-23")])
        .range([margin.left, width - margin.right - margin.left])

    //set new xScale by month/year

    //create stacks

    //create interaction to waterfall

    let points = svg.selectAll("circle")
        .data(nested)
        .enter()
        .append("circle")
        .attr("cx", d => xScale(d.first_wear.date))
        .attr("cy", height/2)
        .attr("r", 10)
        .attr("fill", (d) => {
            if(d.location === "Lawrence") {
                return "blue";
            } else if(d.location === "Portsmouth") {
                return "green";
            } else {
                return "red";
            }
        })
        .attr("opacity", 0.5)
});

function parse(d) {

    return {
        date: new Date(d.date),
        month: new Date(d.date).getMonth() + 1,
        year: new Date(d.date).getYear() - 100,
        week: +d.week,
        description: (d.Brand + " ").concat((d.Description + " ")).concat(d.Sub_Category),
        id: +d.garmentId,
        new: d.new,
        sold: d.sold,
        brand: d.Brand,
        preowned: d.pre
    }

}