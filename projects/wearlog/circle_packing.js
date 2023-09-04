var width = document.querySelector("#chart").clientWidth;
var height = document.querySelector("#chart").clientHeight;
var margin = { top: 50, left: 50, right: 50, bottom: 50 };

var svg = d3.select("#chart")
    .append("svg")
    .attr("width", width)
    .attr("height", height);



d3.csv("./data/wearlog.csv", parse).then(function (data) {
    let nested = d3.nest()
        .key(d => d.id)
        .rollup()
        .entries(data)
    nested.forEach(d => d.description = d.values[0].description)
    console.log(nested)
    function addDays(date, days) {
        const dateCopy = new Date(date);
        dateCopy.setDate(date.getDate() + days);
        return dateCopy;
    }
    let currentDate = data[data.length - 1].date;

    let expanded = [];
    nested.forEach((d) => {
        let daysWorn = []
        let firstWear = d.values[0].date;
        let lastWear = d.values[d.values.length - 1].date;
        d.last = lastWear;
        d.first = firstWear;
        let lifeSpan_in_time;
        if (d.values[0].sold === "Y") {
            lifeSpan_in_time = d.last - d.first;
        } else {
            lifeSpan_in_time = currentDate - d.first;
        }

        let lifeSpan = lifeSpan_in_time / (1000 * 3600 * 24);
        d.lifeSpan = Math.floor(lifeSpan);
        for (let i = 0; i < d.values.length; i++) {
            daysWorn.push(d.values[i].date)
            d.values[i].wearcount = i + 1;
            if (i == 0) {
                d.values[i].days_since = 0;
            } else {
                let Difference_In_Time = d.values[i].date - d.values[i - 1].date;
                let Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
                d.values[i].days_since = Difference_In_Days
            }
        }
        d.daysWorn = daysWorn;
        let days_since = 0;
        let wearcount = 0;

        //we're not consistebntly adding new items and sometimes items are dropping off - figure out why this is happening
        for (let i = 0; i < lifeSpan + 1; i++) {
            let date = addDays(d.first, i);
            idx = daysWorn.map(Number).indexOf(+date);
            if (idx != -1) {
                days_since = 0
                wearcount += 1;
            } else {
                days_since += 1;
            }
            if (i == 0) {
                expanded.push({
                    id: d.key,
                    date: d.first,
                    wearcount: 1,
                    days_since: 0,
                    description: d.description
                })
            } else {
                expanded.push({
                    id: d.key,
                    date: date,
                    wearcount: wearcount,
                    days_since: days_since,
                    description: d.description

                })
            }
        }
    })

    console.log(expanded)
    let dateNest = d3.nest()
        .key(d => d.date)
        .rollup()
        .entries(expanded)
    dateNest.forEach(d => d.key = new Date(d.key))
    console.log(dateNest)

    let slider = d3.select("#selectDate");

    slider
        .property("min", 1)
        .property("max", dateNest.length - 1)
        .property("value", 1);

    let maxCount = d3.max(expanded, d => d.wearcount)
    let max_days_since = d3.max(expanded, d => d.days_since)
    let rScale = d3.scaleSqrt()
        .domain([0, maxCount])
        .range([2, 70])

    let intensityScale = d3.scaleLinear()
        .domain([0, max_days_since])
        .range([0.1, 1])

    let colorScale = d3.scaleSequential()
        .domain([365,1])
        .interpolator(d3.interpolateViridis);
    let selectedDate = slider.property("value");
    let DateLabel = svg.append("text")
        .attr("class", "dateLabel")
        .attr("x", 25)
        .attr("y", height - 100)
        .text(dateNest[selectedDate].key);

    //start circle packing!!

    function draw(val) {
        let simulation = d3.forceSimulation(dateNest[val].values)
            .force('charge', d3.forceManyBody().strength(5))
            .force('center', d3.forceCenter(width / 2, height / 2))
            .force('collision', d3.forceCollide().radius(function (d) {
                return rScale(d.wearcount) + 1
            }))
            .on('tick', ticked);

        function ticked() {
            let u = d3.select('svg')
                .selectAll('circle')
                .data(dateNest[val].values)
                .join('circle')
                .attr('r', function (d) {
                    return rScale(d.wearcount)
                })
                .attr('cx', function (d) {
                    return d.x
                })
                .attr('cy', function (d) {
                    return d.y
                })
                .attr("fill", (d) => {
                    if (d.days_since === 0) {
                        return "#fff";
                    } else {
                        return colorScale(d.days_since);
                    }

                })
                .attr("stroke", "#3B151B")
        }
        DateLabel.text(dateNest[val].key);
    }



    draw(selectedDate);
    slider.on("input", function () {
        let thisDate = this.value;


        selectedDate = thisDate;
        draw(selectedDate);
    })




});

function parse(d) {

    return {
        date: new Date(d.date),
        description: (d.Brand + " ").concat((d.Description + " ")).concat(d.Sub_Category),
        id: +d.garmentId,
        new: d.new,
        sold: d.sold
    }

}