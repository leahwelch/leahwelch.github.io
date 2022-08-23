//Setting up the SVG where we'll be appending everything for our chart
const width = document.querySelector("#chart").clientWidth;
const height = document.querySelector("#chart").clientHeight;
const margin = { top: 100, left: 100, right: 100, bottom: 100 };

const svg = d3.select("#chart")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

//Function to set up the tabs interaction
function showVis(evt) {
    // Declare all variables
    let i, tablinks;

    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    // Show the current tab, and add an "active" class to the button that opened the tab
    evt.currentTarget.className += " active";
}

// Variables for the buttons so we can set up event listeners
const btn1 = d3.select("#btn1");
const btn2 = d3.select("#btn2");
const btn3 = d3.select("#btn3");
const btn4 = d3.select("#btn4");
const btn5 = d3.select("#btn5");
const btn6 = d3.select("#btn6");
const btn7 = d3.select("#btn7");
const btn8 = d3.select("#btn8");
const btn9 = d3.select("#btn9");

d3.csv("./data/home_prices.csv", parsePrices).then(function (data) {
    console.log(data)
    const filtered = data.filter(d => d.medianRecordedSalesPrice != 0 && d.date === "2022-03-01");
    console.log(filtered)
    let rScale = d3.scaleSqrt()
        .domain(d3.extent(filtered, d => d.recordedSalesVolume))
        .range([5, 40])
    let xScale = d3.scaleLinear()
        .range([margin.left, width - margin.right])

    let yScale = d3.scaleLinear()
        .range([height - margin.bottom, margin.top])
    const keys = ["Queens", "Manhattan", "Brooklyn", "Bronx"]

    //set out colors based on our list of keys
    const colorScale = d3.scaleOrdinal()
        .domain(keys)
        .range(["#25CED1", "#6457A6", "#EE2E31", "#F8C648"])
    let nodes = svg.selectAll(".nodes")
        .data(filtered)

    nodes.enter()
        .append("circle")
        .attr("class", "nodes")
        .attr("cx", (width - margin.left - margin.right) / 2)
        .attr("cy", (height - margin.top - margin.bottom) / 2)
        .merge(nodes)
        .attr('fill', 'black')

    nodes.exit()
        .transition()
        .duration(500)
        .attr("cx", (width - margin.left - margin.right) / 2)
        .attr("cy", (height - margin.top - margin.bottom) / 2)
        .remove();

    function update1() {
        let simulation = d3.forceSimulation(filtered)
            .force('x', d3.forceX(width / 2).strength(.1))
            .force('y', d3.forceY(height / 2).strength(.1))
            .force('collide', d3.forceCollide(d => rScale(d.recordedSalesVolume) + 0.5))
        for (let i = 0; i < filtered.length; i++) {
            simulation.tick(10)
        }

        svg.selectAll(".nodes")
            .transition()
            .duration(1000)
            .attr("opacity", 1)
            .attr("fill", "black")
            .attr('r', d => rScale(d.recordedSalesVolume))
            .attr('cx', function (d) {
                return d.x;
            })
            .attr('cy', function (d) {
                return d.y;
            });
    }

    function update2() {
        xScale.domain(d3.extent(filtered, d => d.medianRecordedSalesPrice))
        simulation = d3.forceSimulation(filtered)
            .force("x", d3.forceX((d) => {
                return xScale(+d["medianRecordedSalesPrice"])
            }).strength(0.1))
            .force("y", d3.forceY((height / 2 - margin.bottom / 2)).strength(0.1))
            .force("collide", d3.forceCollide(10.5))

        for (let i = 0; i < filtered.length; i++) {
            simulation.tick(10);
        }
        svg.selectAll(".nodes").transition().duration(500)
            .attr("fill", "black")
            .attr("opacity", 1)
            .attr("cx", d => d.x)
            .attr("cy", d => d.y)
            .attr("r", 10)
    }

    function update3() {
        let simulation = d3.forceSimulation(filtered)
            .force('x', d3.forceX(width / 2).strength(.1))
            .force('y', d3.forceY(height / 2).strength(.1))
            .force("collide", d3.forceCollide(10.5))
        for (let i = 0; i < filtered.length; i++) {
            simulation.tick(10)
        }

        svg.selectAll(".nodes")
            .transition()
            .duration(500)
            .attr("opacity", 1)
            .attr("fill", d => colorScale(d.borough))
            .attr('r', 10)
            .attr('cx', function (d) {
                return d.x;
            })
            .attr('cy', function (d) {
                return d.y;
            });
    }

    function update4() {
        xScale.domain(d3.extent(filtered, d => d.medianRecordedSalesPrice))
        yScale.domain(d3.extent(filtered, d => d.medianDaysOnMarket))
        svg.selectAll(".nodes").transition().duration(500)
            .attr("fill", "black")
            .attr("opacity", 1)
            .attr("cx", d => xScale(d.medianRecordedSalesPrice))
            .attr("cy", d => yScale(d.medianDaysOnMarket))
            .attr("r", 10)
    }

    function update5() {
        yScale.domain(d3.extent(filtered, d => d.medianDaysOnMarket))
        simulation = d3.forceSimulation(filtered)
            .force("y", d3.forceY((d) => {
                return yScale(+d["medianDaysOnMarket"])
            }).strength(0.1))
            .force("x", d3.forceX((width / 2 - margin.left / 2)).strength(0.1))
            .force("collide", d3.forceCollide(10.5))

        for (let i = 0; i < filtered.length; i++) {
            simulation.tick(10);
        }
        svg.selectAll(".nodes").transition().duration(500)
            .attr("fill", "black")
            .attr("opacity", 1)
            .attr("cx", d => d.x)
            .attr("cy", d => d.y)
            .attr("r", 10)
    }

    function update6() {

        yScale.domain(d3.extent(filtered, d => d.medianDaysOnMarket))
        simulation = d3.forceSimulation(filtered)
            .force("y", d3.forceY((d) => {
                return yScale(+d["medianDaysOnMarket"])
            }).strength(0.1))
            .force("x", d3.forceX((width / 2 - margin.left / 2)).strength(0.1))
            .force('collide', d3.forceCollide(d => rScale(d.recordedSalesVolume) + 0.5))

        for (let i = 0; i < filtered.length; i++) {
            simulation.tick(10);
        }
        svg.selectAll(".nodes").transition().duration(500)
            .attr("fill", "black")
            .attr("opacity", 1)
            .attr("cx", d => d.x)
            .attr("cy", d => d.y)
            .attr("r", d=>rScale(d.recordedSalesVolume))
    }

    function update7() {
    }

    function update8() {
    }

    function update9() {
    }

    update1();
    btn1.on("click", function () {
        update1();
    });
    btn2.on("click", function () {
        update2();
    });
    btn3.on("click", function () {
        update3();
    });
    btn4.on("click", function () {
        update4();
    });
    btn5.on("click", function () {
        update5();
    });
    btn6.on("click", function () {
        update6();
    });
    btn7.on("click", function () {
        update7();
    });
    btn8.on("click", function () {
        update8();
    });
    btn9.on("click", function () {
        update9();
    });
});

function parsePrices(d) {
    return {
        neighborhood: d.neighborhood,
        borough: d.borough,
        date: d.date,
        medianDaysOnMarket: +d.medianDaysOnMarket,
        medianAskingPrice: +d.medianAskingPrice,
        medianRecordedSalesPrice: +d.medianRecordedSalesPrice,
        priceCutShare: +d.priceCutShare,
        recordedSalesVolume: +d.recordedSalesVolume,
        saleListRatio: +d.saleListRatio,
        totalInventory: +d.totalInventory,
        priceDiff: +d.medianRecordedSalesPrice - +d.medianAskingPrice
    }
}