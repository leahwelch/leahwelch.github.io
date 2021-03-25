const size = {w: 350, h: 300};

// contains the full timeilne
const timeSVG = d3.select('svg.time');
// contains the detailed bar chart
const delaySVG = d3.select('svg.delay');

// defining a container group
// which will contain everything within the SVG
// we can transform it to make things everything zoomable
const timeG = timeSVG.append('g').classed('container', true);
const delayG = delaySVG.append('g').classed('container', true);

// defining all the required variables as global
let flightsData,
    delayScaleX, delayScaleY,
    timeScaleX, timeScaleY,
    timeBrush, arrivalBrush, filters = {};


// setting width and height of the SVG elements
timeSVG.attr('width', size.w)
    .attr('height', size.h);
delaySVG.attr('width', size.w)
    .attr('height', size.h);

// loading our data
Promise.all([
    d3.csv('data/flights-filtered.csv')
]).then(function (datasets) {
    // processing data a bit to calculate dates and change strings to numbers
    flightsData = datasets[0].map((row, i) => {
        row.date = new Date(row.date*1000);
        row.delay = +row.delay;
        row.distance = +row.distance;
        row.id = i;

        return row;
    });


        
    drawTimeChart();
    drawDelayChart();

    timeBrush = d3.brushX()
        .extent([
            [0,0],[size.w, size.h]]) 
        .on('end', function(event) {
            if(!event.selection) return;

            let step = timeScaleX.step();
            let lowerIndex = Math.floor(event.selection[0]/step);
            let  lowerVal = timeScaleX.domain()[lowerIndex];
            
            let upperIndex = Math.floor(event.selection[0]/step);
            let  upperVal = timeScaleX.domain()[lowerIndex];
            if (upperIndex > timeScaleX.domain()) {
                upperVal = timeScaleXdomain()[23;
            }else {
                upperVal = timeScaleX.domain() [domainIndex];
            }
            

            filters.time = [lowerVal, upperVal];
            updateData();
        }); 
        timeSVG.call(timeBrush);


    arrivalBrush = d3.brushX()
        .extent([
            [0,0], //origin
            [size.w, size.h]
        ]) 
        .on('end', function(event) {
                console.log('brush', event.selection);

                let lowerVal = delayScaleY.invert(event.election[0]);
                let upperVal = delayScaleY.invert(event.election[1]);
                console.log(lowerVal, upperVal);

                filters.delay = [lowerVal, upperVal];
                updateData();

        });
        delaySVG.call(arrivalBrush);


});

function updateData() {
    let filteredData = flightsData;
    if (filters.delay) { 
        filteredData = filterdData.filter(function(d) {
        return d.delay >= filters.delay[0] && d.delay <= filters.delay[1];
    });
        if (filters.time) { 
            filteredData = filterdData.filter(function(d) {
            return d.date.getHours() >= filters.delay[0] && d.date.getHours() <= filters.time[1];
        });
    }

    drawDelayChart(filteredData);
    drawTimeChart(filteredData);
}

// DRAW BAR CHART for time
function drawTimeChart(data = flightsData) {

// domain creating domain of 24 we add ... to have from 0 to 23

    if(!timeScaleX) {
        timeScaleX = d3.scaleBand()
.domain([...Array(24).keys()]) 
.range([0, size.w])
.padding([0.2]);
    }

// lets calculate duration of flights from data, group data set based on time of the day
let nestedData = d3.group(flightsData, d=> d.date.getHours() );
nestedData = Array.from(nestedData);
console.log(nestedData[0]);

if (timeScaleY) {
    timeScaleY = d3.scaleLinear()
    .domain([0, d3.max(nestedData, d=> d[1].length)])
    .range([size.h, 0]);
}

    timeG.selectAll('rect')
        .data(nestedData)
        .join('rect')
        .attr('width', timeScaleX.bandwidth() )
        .attr('height', d=> size.h - timeScaleY(d[1].length) )
        .attr('x', d=> timeScaleX(d[0]) )
        .attr('y', d=> timeScaleY(d[1].length) )

}

// DRAW LINE CHART for delay
function drawDelayChart(data = flightsData) {
    let nestedData = d3.group(data, d=> d.delay)
    nestedData = Array.from(nestedData);
    nestedData = nestedData.sort(function(a,b) { return a[0] > b[0];})

    
    if(!delayScaleY) {
        delayScaleY = d3.scaleLinear()
        .domain([0, d3.max(nestedData, d=> d[1].length)])
        .range([size.h, 0]);
    }

    if (!delayScaleX) {
        delayScaleX = d3.scaleLinear()
        .domain([0,d3.max(data, d => d.delay)])
        .range([0, size.w]);
    }

    let pathFn = d3.line()
        .x(d=> delayScaleX(d[0]))
        .y(d => delayScaleY(d[1].length));


    delayG.selectAll('path')
        .data([1])
        .join('path')
        .datum(nestedData)
        .attr('d', d=> pathFn(d));
}


// LOADING TABLE
function loadTable(data = flightsData) {
}