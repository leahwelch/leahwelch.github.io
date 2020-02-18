// INITIAL SETUP OF SVGs //

var width = document.querySelector("#ancientTime").clientWidth;
var height = document.querySelector("#ancientTime").clientHeight;
var margin = {top: 0, left: 0, right: 0, bottom: 0};

var svgAncient = d3.select("#ancientTime")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

var svgMuslim = d3.select("#muslimTime")
    .append("svg")
    .attr("class", "svgMuslim")
    .attr("width", width)
    .attr("height", height);

var svgBritish = d3.select("#britishTime")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

var svgIndependence = d3.select("#independenceTime")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

// DATASETS FOR EACH TIME PERIOD //

var ancientData = [
    {name: "indus", position: "left", start: 0, end: 550},
    {name: "sanskrit", position: "right", start: 300, end: 1300},
    {name: "greek", position: "left", start: 1970, end: 1980},
    {name: "division", position: "right", start: 2900, end: 3400}
];

var muslimData = [
    {name: "mughal", position: "left", start: 326, end: 650},
    {name: "delhi", position: "right", start: 6, end: 214},
    {name: "vasco", position: "right", start: 297, end: 298},
    {name: "east", position: "right", start: 400, end: 401},
    {name: "paris", position: "right", start: 563, end: 564}
];

var britishData = [
    {name: "mughal2", position: "left", start: 0, end: 87},
    {name: "hastings", position: "right", start: 2, end: 15},
    {name: "south", position: "right", start: 29, end: 49},
    {name: "rebellion", position: "right", start: 87, end: 88},
    {name: "congress", position: "left", start: 115, end: 116},
    {name: "gandhi", position: "left", start: 150, end: 152}
];

var independenceData = [
    {name: "kashmir", position: "left", start: 0, end: 1},
    {name: "constitution", position: "left", start: 8, end: 9},
    {name: "nuclear", position: "left", start: 55, end: 56},
    {name: "commonwealth", position: "right", start: 0, end: 1},
    {name: "war", position: "right", start: 18, end: 19},
    {name: "bangladesh", position: "right", start: 24, end: 25}
];

// SCALES //

var xScale = d3.scaleBand()
    .domain(["left", "right"])
    .range([0, width])
    .padding([1]);
    
var ancientyScale = d3.scaleLinear()
    .domain([3500, 0])
    .range([height, margin.top]);

var muslimyScale = d3.scaleLinear()
    .domain([650, 0])
    .range([height+2, margin.top]);

var britishyScale = d3.scaleLinear()
    .domain([175, 0])
    .range([height, margin.top]);

var independenceyScale = d3.scaleLinear()
    .domain([62, 0])
    .range([height, margin.top]);

// FILTERING BY TIMELINE EVENT //

var indus = ancientData.filter(function(d){
    return d.name === "indus";
});

var sanskrit = ancientData.filter(function(d){
    return d.name === "sanskrit";
});

var greek = ancientData.filter(function(d){
    return d.name === "greek";
});

var division = ancientData.filter(function(d){
    return d.name === "division";
});

var mughal = muslimData.filter(function(d){
    return d.name === "mughal";
});

var delhi = muslimData.filter(function(d){
    return d.name === "delhi";
});

var vasco = muslimData.filter(function(d){
    return d.name === "vasco";
});

var east = muslimData.filter(function(d){
    return d.name === "east";
});

var paris = muslimData.filter(function(d){
    return d.name === "paris";
});

var mughal2 = britishData.filter(function(d){
    return d.name === "mughal2";
});

var hastings = britishData.filter(function(d){
    return d.name === "hastings";
});

var south = britishData.filter(function(d){
    return d.name === "south";
});

var rebellion = britishData.filter(function(d){
    return d.name === "rebellion";
});

var congress = britishData.filter(function(d){
    return d.name === "congress";
});

var gandhi = britishData.filter(function(d){
    return d.name === "gandhi";
});

var kashmir = independenceData.filter(function(d){
    return d.name === "kashmir";
});

var constitution = independenceData.filter(function(d){
    return d.name === "constitution";
});

var nuclear = independenceData.filter(function(d){
    return d.name === "nuclear";
});

var commonwealth = independenceData.filter(function(d){
    return d.name === "commonwealth";
});

var war = independenceData.filter(function(d){
    return d.name === "war";
});

var bangladesh = independenceData.filter(function(d){
    return d.name === "bangladesh";
});

// DRAW THE BARS FOR EACH TIMELINE EVENT //

var indusBar = svgAncient.selectAll("myRect")   
    .data(indus)
    .enter()
    .append("rect")
        .attr("x", function(d) {return xScale(d.position); } )
        .attr("y", function(d) {return ancientyScale(d.start); } ) 
        .attr("width", "20px")
        .attr("height", function(d) { return ancientyScale(d.end)-ancientyScale(d.start); })
        .attr("fill", "#450000");

var sanskritBar = svgAncient.selectAll("myRect")   
    .data(sanskrit)
    .enter()
    .append("rect")
        .attr("x", function(d) {return xScale(d.position); } )
        .attr("y", function(d) {return ancientyScale(d.start); } ) 
        .attr("width", "20px")
        .attr("height", function(d) { return ancientyScale(d.end)-ancientyScale(d.start); })
        .attr("fill", "#450000");

var greekBar = svgAncient.selectAll("myRect")   
    .data(greek)
    .enter()
    .append("rect")
        .attr("x", function(d) {return xScale(d.position); } )
        .attr("y", function(d) {return ancientyScale(d.start); } ) 
        .attr("width", "20px")
        .attr("height", function(d) { return ancientyScale(d.end)-ancientyScale(d.start); })
        .attr("fill", "#450000");

var divisionBar = svgAncient.selectAll("myRect")   
    .data(division)
    .enter()
    .append("rect")
        .attr("x", function(d) {return xScale(d.position); } )
        .attr("y", function(d) {return ancientyScale(d.start); } ) 
        .attr("width", "20px")
        .attr("height", function(d) { return ancientyScale(d.end)-ancientyScale(d.start); })
        .attr("fill", "#450000");

var mughalBar = svgMuslim.selectAll("myRect")   
    .data(mughal)
    .enter()
    .append("rect")
        .attr("x", function(d) {return xScale(d.position); } )
        .attr("y", function(d) {return muslimyScale(d.start); } ) 
        .attr("width", "20px")
        .attr("height", function(d) { return muslimyScale(d.end)-muslimyScale(d.start); })
        .attr("fill", "#450000");

var delhiBar = svgMuslim.selectAll("myRect")   
    .data(delhi)
    .enter()
    .append("rect")
        .attr("x", function(d) {return xScale(d.position); } )
        .attr("y", function(d) {return muslimyScale(d.start); } ) 
        .attr("width", "20px")
        .attr("height", function(d) { return muslimyScale(d.end)-muslimyScale(d.start); })
        .attr("fill", "#450000");

var vascoBar = svgMuslim.selectAll("myRect")   
    .data(vasco)
    .enter()
    .append("rect")
        .attr("x", function(d) {return xScale(d.position); } )
        .attr("y", function(d) {return muslimyScale(d.start); } ) 
        .attr("width", "20px")
        .attr("height", function(d) { return muslimyScale(d.end)-muslimyScale(d.start); })
        .attr("fill", "#450000");

var eastBar = svgMuslim.selectAll("myRect")   
    .data(east)
    .enter()
    .append("rect")
        .attr("x", function(d) {return xScale(d.position); } )
        .attr("y", function(d) {return muslimyScale(d.start); } ) 
        .attr("width", "20px")
        .attr("height", function(d) { return muslimyScale(d.end)-muslimyScale(d.start); })
        .attr("fill", "#450000");

var parisBar = svgMuslim.selectAll("myRect")   
    .data(paris)
    .enter()
    .append("rect")
        .attr("x", function(d) {return xScale(d.position); } )
        .attr("y", function(d) {return muslimyScale(d.start); } ) 
        .attr("width", "20px")
        .attr("height", function(d) { return muslimyScale(d.end)-muslimyScale(d.start); })
        .attr("fill", "#450000");

var mughal2Bar = svgBritish.selectAll("myRect")   
    .data(mughal2)
    .enter()
    .append("rect")
        .attr("x", function(d) {return xScale(d.position); } )
        .attr("y", function(d) {return britishyScale(d.start); } ) 
        .attr("width", "20px")
        .attr("height", function(d) { return britishyScale(d.end)-britishyScale(d.start); })
        .attr("fill", "#450000");

var hastingsBar = svgBritish.selectAll("myRect")   
    .data(hastings)
    .enter()
    .append("rect")
        .attr("x", function(d) {return xScale(d.position); } )
        .attr("y", function(d) {return britishyScale(d.start); } ) 
        .attr("width", "20px")
        .attr("height", function(d) { return britishyScale(d.end)-britishyScale(d.start); })
        .attr("fill", "#450000");

var southBar = svgBritish.selectAll("myRect")   
    .data(south)
    .enter()
    .append("rect")
        .attr("x", function(d) {return xScale(d.position); } )
        .attr("y", function(d) {return britishyScale(d.start); } ) 
        .attr("width", "20px")
        .attr("height", function(d) { return britishyScale(d.end)-britishyScale(d.start); })
        .attr("fill", "#450000");

var rebellionBar = svgBritish.selectAll("myRect")   
    .data(rebellion)
    .enter()
    .append("rect")
        .attr("x", function(d) {return xScale(d.position); } )
        .attr("y", function(d) {return britishyScale(d.start); } ) 
        .attr("width", "20px")
        .attr("height", function(d) { return britishyScale(d.end)-britishyScale(d.start); })
        .attr("fill", "#450000");

var congressBar = svgBritish.selectAll("myRect")   
    .data(congress)
    .enter()
    .append("rect")
        .attr("x", function(d) {return xScale(d.position); } )
        .attr("y", function(d) {return britishyScale(d.start); } ) 
        .attr("width", "20px")
        .attr("height", function(d) { return britishyScale(d.end)-britishyScale(d.start); })
        .attr("fill", "#450000");

var gandhiBar = svgBritish.selectAll("myRect")   
    .data(gandhi)
    .enter()
    .append("rect")
        .attr("x", function(d) {return xScale(d.position); } )
        .attr("y", function(d) {return britishyScale(d.start); } ) 
        .attr("width", "20px")
        .attr("height", function(d) { return britishyScale(d.end)-britishyScale(d.start); })
        .attr("fill", "#450000");

var kashmirBar = svgIndependence.selectAll("myRect")   
    .data(kashmir)
    .enter()
    .append("rect")
        .attr("x", function(d) {return xScale(d.position); } )
        .attr("y", function(d) {return independenceyScale(d.start); } ) 
        .attr("width", "20px")
        .attr("height", function(d) { return independenceyScale(d.end)-independenceyScale(d.start); })
        .attr("fill", "#450000");

var constitutionBar = svgIndependence.selectAll("myRect")   
    .data(constitution)
    .enter()
    .append("rect")
        .attr("x", function(d) {return xScale(d.position); } )
        .attr("y", function(d) {return independenceyScale(d.start); } ) 
        .attr("width", "20px")
        .attr("height", function(d) { return independenceyScale(d.end)-independenceyScale(d.start); })
        .attr("fill", "#450000");

var nuclearBar = svgIndependence.selectAll("myRect")   
    .data(nuclear)
    .enter()
    .append("rect")
        .attr("x", function(d) {return xScale(d.position); } )
        .attr("y", function(d) {return independenceyScale(d.start); } ) 
        .attr("width", "20px")
        .attr("height", function(d) { return independenceyScale(d.end)-independenceyScale(d.start); })
        .attr("fill", "#450000");

var commonwealthBar = svgIndependence.selectAll("myRect")   
    .data(commonwealth)
    .enter()
    .append("rect")
        .attr("x", function(d) {return xScale(d.position); } )
        .attr("y", function(d) {return independenceyScale(d.start); } ) 
        .attr("width", "20px")
        .attr("height", function(d) { return independenceyScale(d.end)-independenceyScale(d.start); })
        .attr("fill", "#450000");

var warBar = svgIndependence.selectAll("myRect")   
    .data(war)
    .enter()
    .append("rect")
        .attr("x", function(d) {return xScale(d.position); } )
        .attr("y", function(d) {return independenceyScale(d.start); } ) 
        .attr("width", "20px")
        .attr("height", function(d) { return independenceyScale(d.end)-independenceyScale(d.start); })
        .attr("fill", "#450000");

var bangladeshBar = svgIndependence.selectAll("myRect")   
    .data(bangladesh)
    .enter()
    .append("rect")
        .attr("x", function(d) {return xScale(d.position); } )
        .attr("y", function(d) {return independenceyScale(d.start); } ) 
        .attr("width", "20px")
        .attr("height", function(d) { return independenceyScale(d.end)-independenceyScale(d.start); })
        .attr("fill", "#450000");

// GET TOP POSITION OF BARS FOR LABELS AND MOVE HTML LABELS TO CORRECT SPOTS //

//ANCIENT//

var indusTop = indusBar.attr("y");
var sanskritTop = sanskritBar.attr("y");
var greekTop = greekBar.attr("y");
var divisionTop = divisionBar.attr("y");

var indusEl = document.getElementById("indus");
indusEl.style.paddingTop = indusTop + "px";

var sanskritEl = document.getElementById("sanskrit")
sanskritEl.style.paddingTop = sanskritTop + "px";

document.getElementById("greek").style.paddingTop = (greekTop - (indusEl.getBoundingClientRect().height) - 5) + "px";
document.getElementById("division").style.paddingTop = (divisionTop - (sanskritEl.getBoundingClientRect().height)) + "px";

//MUSLIM//

var mughalTop = mughalBar.attr("y");
var delhiTop = delhiBar.attr("y");
var vascoTop = vascoBar.attr("y");
var eastTop = eastBar.attr("y");
var parisTop = parisBar.attr("y");

document.getElementById("mughal").style.paddingTop = mughalTop + "px";

var delhiEl = document.getElementById("delhi");
delhiEl.style.paddingTop = delhiTop + "px";

var vascoEl = document.getElementById("vasco");
vascoEl.style.paddingTop = (vascoTop - (delhiEl.getBoundingClientRect().height) - 5) + "px";

var eastEl = document.getElementById("east");
eastEl.style.paddingTop = (eastTop - (vascoEl.getBoundingClientRect().height) - (delhiEl.getBoundingClientRect().height) - 5) + "px";

var parisEl = document.getElementById("paris");
parisEl.style.paddingTop = (parisTop - (eastEl.getBoundingClientRect().height) - (vascoEl.getBoundingClientRect().height) - (delhiEl.getBoundingClientRect().height) - 5) + "px";

//BRITISH//

var hastingsTop = hastingsBar.attr("y");
var southTop = southBar.attr("y");
var rebellionTop = rebellionBar.attr("y");
var congressTop = congressBar.attr("y");
var gandhiTop = gandhiBar.attr("y");

var hastingsEl = document.getElementById("hastings")
hastingsEl.style.paddingTop = (hastingsTop - 5) + "px";

var southEl = document.getElementById("south")
southEl.style.paddingTop = (southTop - hastingsEl.getBoundingClientRect().height - 5) + "px";

var rebellionEl = document.getElementById("rebellion")
rebellionEl.style.paddingTop = (rebellionTop - southEl.getBoundingClientRect().height - hastingsEl.getBoundingClientRect().height - 5) + "px";

var congressEl = document.getElementById("congress")
congressEl.style.paddingTop = (congressTop - 5) + "px";

document.getElementById("gandhi").style.paddingTop = (gandhiTop - congressEl.getBoundingClientRect().height - 5) + "px";


//INDEPENDENCE//

var kashmirTop = kashmirBar.attr("y");
var constitutionTop = constitutionBar.attr("y");
var nuclearTop = nuclearBar.attr("y");
var commonwealthTop = commonwealthBar.attr("y");
var warTop = warBar.attr("y");
var bangladeshTop = bangladeshBar.attr("y");

var kashmirEl = document.getElementById("kashmir")
kashmirEl.style.paddingTop = (kashmirTop - 5) + "px";

var constitutionEl = document.getElementById("constitution")
constitutionEl.style.paddingTop = (constitutionTop - kashmirEl.getBoundingClientRect().height - 5) + "px";

var nuclearEl = document.getElementById("nuclear")
nuclearEl.style.paddingTop = (nuclearTop - constitutionEl.getBoundingClientRect().height - kashmirEl.getBoundingClientRect().height - 5) + "px";

var commonwealthEl = document.getElementById("commonwealth")
commonwealthEl.style.paddingTop = (commonwealthTop - 5) + "px";

var warEl = document.getElementById("war")
warEl.style.paddingTop = (warTop - commonwealthEl.getBoundingClientRect().height - 5) + "px";

var bangladeshEl = document.getElementById("bangladesh")
bangladeshEl.style.paddingTop = (bangladeshTop - warEl.getBoundingClientRect().height - commonwealthEl.getBoundingClientRect().height - 5) + "px";



