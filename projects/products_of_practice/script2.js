const width = document.querySelector("#chart").clientWidth;
const height = document.querySelector("#chart").clientHeight;
const margin = { top: 10, left: 10, right: 10, bottom: 10 };

const suppWidth = document.querySelector("#supplement").clientWidth;
const suppHeight = document.querySelector("#supplement").clientHeight;

const svg = d3.select("#chart")
    .append("svg")
    .attr("width", width - margin.left - margin.right)
    .attr("height", height - margin.top - margin.bottom);


const supp = d3.select("#supplement")
    .append("svg")
    .attr("width", suppWidth)
    .attr("height", suppHeight);

const nodeGroup = svg.append("g")
    .attr("class", "nodeGroup")
    .attr("transform", `translate(0,0)`)

const medievalBtn = d3.select("#medieval");
const renBtn = d3.select("#renaissance");
const frenchBtn = d3.select("#frenchRev");
const industrialBtn = d3.select("#industrial");
const modernBtn = d3.select("#modern");
const contemporaryBtn = d3.select("#contemporary");

const numNodes = 100;
let perc_so_far = 0;
let prev_perc = 0;
let this_perc = 0;

let rScale = d3.scaleSqrt()
    .domain([0, 100])
    .range([10, 90])

let rScaleSub = d3.scaleSqrt()
    .domain([0, 1])
    .range([0.25, 12])

function showVis(evt) {
    // Declare all variables
    var i, tablinks;

    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    // Show the current tab, and add an "active" class to the button that opened the tab
    evt.currentTarget.className += " active";
}

d3.json("./data/text_all.json").then(function (data) {
    let medievalData = data.product[0].sub_products;
    let renData = data.product[1].sub_products;
    let frenchData = data.product[2].sub_products;
    let industrialData = data.product[3].sub_products;
    let modernData = data.product[4].sub_products;
    let contemporaryData = data.product[5].sub_products;

    function showViz(dataset) {
        let array = [];
        for (let i = 0; i < dataset.length; i++) {
            for (j = 0; j < dataset[i].market_share; j++) {
                array.push({ category: dataset[i].name, color: dataset[i].color, innovation: dataset[i].innovation })
            }
        }

        let nested = d3.nest()
            .key(d => d.color)
            .rollup()
            .entries(array)

        let suppData = []
        for (let i = 0; i < nested.length; i++) {
            suppData.push({ group: nested[i].values[0].category, color: nested[i].key, value: nested[i].values.length })
        }

        function zeroState(selection) {
            prev_perc = 0;
            this_perc = 0;
            perc_so_far = 0;
            selection
                .attr('x', width)
                .attr('y', 0)
                .attr("width", 0)
                .attr('height', 0)
        }

        let bar = supp.selectAll(".bars")
            .data(suppData)

        bar.enter()
            .append("rect")
            .attr("class", "bars")
            .call(zeroState)
            .merge(bar)
            .transition()
            .duration(1000)
            .delay(50)
            .attr("width", function (d) { return ((d.value / numNodes) * 100) + "%"; })
            .attr("x", function (d) {
                prev_perc = perc_so_far;
                this_perc = 100 * (d.value / numNodes);
                perc_so_far = perc_so_far + this_perc;
                console.log("perc_so_far:" + perc_so_far + "; this_perc:" + this_perc + "; prev_perc:" + prev_perc + ";");
                return prev_perc + "%";
            })
            .attr("height", 20)
            .attr("stroke", "#ffffff")
            .attr("stroke-width", 2)
            .attr("fill", function (d) { return d.color });


        bar.exit()
            .transition()
            .duration(500)
            .call(zeroState)
            .remove();

        let barLabels = supp.selectAll(".labels")
            .data(suppData)

        barLabels.enter().append("text")
            .attr("class", "labels")
            .attr("opacity", 0)
            .merge(barLabels)
            .transition()
            .duration(1000)
            .delay(50)
            .attr("x", function (d) {
                prev_perc = perc_so_far;
                this_perc = 100 * (d.value / numNodes);
                perc_so_far = perc_so_far + this_perc;
                return prev_perc + '%';
            })
            .attr("dy", 35)

            // .attr('transform', (d,i)=>{
            //     prev_perc = perc_so_far;
            //     this_perc = 100 * (d.value / numNodes);
            //     perc_so_far = perc_so_far + this_perc;
            //     return 'translate( ' + prev_perc + '%' + ' , ' + 200 + '),'+ 'rotate(45)';})
            // .attr('x', 0)
            // .attr('y', 0)
            // .style("text-anchor", "start")
            .text(function (d) { return d.group; }) //figure out text-wrapping!!!
            .attr("opacity", 1);

        // supp.selectAll(".labels")
        //     .attr("transform", function (d) { return ("translate(30,10)rotate(45)") })
        //     .style("text-anchor", "start")

        barLabels.exit()
            .transition()
            .duration(500)
            .attr("opacity", 0)
            .remove();


        let simulation = d3.forceSimulation(nested)
            .force('charge', d3.forceManyBody().strength(10))
            .force('center', d3.forceCenter((width - margin.left - margin.right) / 2, (height - margin.top - margin.bottom) / 2))
            .force('collision', d3.forceCollide().radius(d => rScale(d.values.length) * d.values[0].innovation + 20))
        for (let i = 0; i < nested.length; i++) {
            simulation.tick(10)
        }
        array.forEach(function (d) {
            for (let i = 0; i < nested.length; i++) {
                if (d.color == nested[i].key) {
                    d.cx = nested[i].x
                    d.cy = nested[i].y
                }
            }
        })
        let xVals = [];
        for (let i = 0; i < nested.length; i++) {
            xVals.push(nested[i].x)
        }
        console.log(xVals);

        console.log(array)
        let subSimulation = d3.forceSimulation(array)
            .force("charge", d3.forceManyBody().strength(4))
            .force("collide", d3.forceCollide().radius(d => rScaleSub(d.innovation) + 1))
            .force('x', d3.forceX().x(d => d.cx))
            .force('y', d3.forceY().y(d => d.cy))

        for (let i = 0; i < array.length; i++) {
            subSimulation.tick(10)
        }

        let nodes = nodeGroup.selectAll(".nodes")
            .data(array)

        nodes.exit()
            .transition()
            .duration(500)
            .attr("cx", (width - margin.left - margin.right) / 2)
            .attr("cy", (height - margin.top - margin.bottom) / 2)
            .remove();

        nodes.enter()
            .append("circle")
            .attr("class", "nodes")
            .attr("cx", (width - margin.left - margin.right) / 2)
            .attr("cy", (height - margin.top - margin.bottom) / 2)
            .merge(nodes)
            .transition()
            .duration(1000)
            .delay(50)
            .attr('fill', function (d) {
                return d.color;
            })
            .attr("r", d => rScaleSub(d.innovation))
            .attr('cx', function (d) {
                return d.x;
            })
            .attr('cy', function (d) {
                return d.y;
            });

    }

    showViz(medievalData);

    medievalBtn.on("click", function () {
        showViz(medievalData);
    });
    renBtn.on("click", function () {
        showViz(renData);
    });
    frenchBtn.on("click", function () {
        showViz(frenchData);
    });
    industrialBtn.on("click", function () {
        showViz(industrialData);
    });
    modernBtn.on("click", function () {
        showViz(modernData);
    });
    contemporaryBtn.on("click", function () {
        showViz(contemporaryData);
    });

});