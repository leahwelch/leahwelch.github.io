var width = document.querySelector("#chart").clientWidth;
var height = document.querySelector("#chart").clientHeight;
var margin = { top: 50, left: 50, right: 50, bottom: 50 };

var svg = d3.select("#chart")
    .append("svg")
    .attr("width", width)
    .attr("height", height);


d3.csv("./data/wearlog.csv", parse).then(function (data) {

    let totalNest = d3.nest()
        .key(d => d.id)
        .rollup()
        .entries(data)
    
    let pre = data.filter(d => d.date < new Date("2021-02-01"))

    let preNest = d3.nest()
        .key(d => d.id)
        .rollup()
        .entries(pre)
        .sort((a,b) => d3.descending(a.values.length, b.values.length))
    console.log(preNest)

    let bt = data.filter(d => d.date >= new Date("2021-02-01") && d.date < new Date("2022-08-03"))

    let btNest = d3.nest()
        .key(d => d.id)
        .rollup()
        .entries(bt)
        .sort((a,b) => d3.descending(a.values.length, b.values.length))
    console.log(btNest)

    let unemployed = data.filter(d => d.date >= new Date("2022-08-03") && d.date < new Date("2022-10-17"))

    let unemployedNest = d3.nest()
        .key(d => d.id)
        .rollup()
        .entries(unemployed)
        .sort((a,b) => d3.descending(a.values.length, b.values.length))
    console.log(unemployedNest)

    let capOne = data.filter(d => d.date >= new Date("2022-10-17") && d.date < new Date("2023-04-30"))

    let capNest = d3.nest()
        .key(d => d.id)
        .rollup()
        .entries(capOne)
        .sort((a,b) => d3.descending(a.values.length, b.values.length))
    console.log(capNest)

    let ps = data.filter(d => d.date >= new Date("2023-05-01"))

    let psNest = d3.nest()
        .key(d => d.id)
        .rollup()
        .entries(ps)
        .sort((a,b) => d3.descending(a.values.length, b.values.length))
    console.log(psNest)

    let combined = [
        {
            key: "total",
            values: totalNest
        },
        {
            key: "pre",
            values: preNest
        },
        {
            key: "bt",
            values: btNest
        },
        {
            key: "unemployed",
            values: unemployedNest
        },
        {
            key: "capOne",
            values: capNest
        },
        {
            key: "ps",
            values: psNest
        }
    ]
    console.log(combined)

    let yScale = d3.scalePoint()
        .domain(combined.map(d => d.key))
        .range([margin.top, height - margin.bottom])
        .padding(0.1)

    let wearMax = d3.max(combined[0].values, d => d.values.length)

    let xScale = d3.scaleLinear()
        .domain([0, wearMax])
        .range([margin.left, width - margin.right])

    const grouping = svg.selectAll(".grouping")
        .data(combined)
        .enter()
        .append("g")
        .attr("class", "grouping")
        .attr("transform", (d) => `translate(0,${yScale(d.key)})`)

    grouping.selectAll(".circ")
        .data(d => d.values)
        .enter()
        .append("circle")
        .attr("class", "circ")
        .attr("r", 3)
        .attr("cx", (d) => xScale(d.values.length))
        .attr("cy", 0);

    for (let i = 0; i < combined.length; i++) {
        let dataset = combined[i].values;
        let simulation = d3.forceSimulation(dataset)

            .force("x", d3.forceX((d) => {
                return xScale(d.values.length);
            }).strength(1))
            .force("y", d3.forceY(0).strength(1))
            .force("collide", d3.forceCollide(4))
            .alphaDecay(0)
            .alpha(0.3)
            .on("tick", tick);

        function tick() {
            d3.selectAll(".circ")
                .attr("cx", (d) => d.x)
                .attr("cy", (d) => d.y);
        }

        let init_decay = setTimeout(function () {
            console.log("start alpha decay");
            simulation.alphaDecay(0.1);
        }, 500); // start decay after 3 seconds

    }

    //define the tooltip
    let tooltip = d3.select("#chart")
        .append("div")
        .attr("class", "tooltip");


    svg.selectAll(".circ").on("click", function (d) {
        console.log(d)
        d3.select(this).attr("fill", "red")
        svg.selectAll(".circ")
            .attr("fill", (p) => {
                if (p.key === d.key) {
                    return "red"
                }
            })

        //grab the position of the node that we're hovering on    
        var cx = event.clientX;
        var cy = event.clientY;
        //make the tooltip visible
        tooltip.style("visibility", "visible")
            .style("left", cx + "px")
            .style("top", cy + "px")
            .text(d.key + ": " + Math.round(d.values.length)); //the text that shows up in the tooltip
        //all other circles fall away slightly
    }).on("mouseout", function () {
        svg.selectAll(".circ").attr("fill", "black")
        tooltip.style("visibility", "hidden");
    })




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