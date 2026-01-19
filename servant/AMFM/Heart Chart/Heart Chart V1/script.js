//COLORS
// #b0bbc8, #b99988, #d1b977

const width = 650,
    height = 650

const margin = {
    top: 50,
    right: 50,
    bottom: 50,
    left: 50
}

const radius = width / 2 - margin.left - margin.right
const rect_width = ((radius - radius / 4) / 2)

const svg = d3.select("#chart")
    .append("svg")
    .attr("width", width)
    .attr("height", height)

svg.append("circle")
    .attr("class", "outer_ring")
    .attr("cx", width / 2 + margin.left)
    .attr("cy", height / 2 + margin.top)
    .attr("r", radius)
    .attr("stroke", "black")
    .attr("fill", "none")

svg.append("rect")
    .attr("class", "vertical_rect")
    .attr("x", width / 2 + margin.left - radius / 4)
    .attr("y", height / 2 + margin.top - radius)
    .attr("height", radius * 2)
    .attr("width", radius / 2)
    .attr("stroke", "black")
    .attr("fill", "none")

svg.append("rect")
    .attr("class", "horizontal_rect")
    .attr("x", width / 2 + margin.left - radius)
    .attr("y", height / 2 + margin.top - radius / 4)
    .attr("width", radius * 2)
    .attr("height", radius / 2)
    .attr("stroke", "black")
    .attr("fill", "none")

svg.append("circle")
    .attr("class", "inner_ring")
    .attr("cx", width / 2 + margin.left)
    .attr("cy", height / 2 + margin.top)
    .attr("r", radius / 4)
    .attr("stroke", "black")
    .attr("fill", "none")

//STEADY
svg.append("circle")
    .attr("r", 5)
    .attr("cx", width / 2 + margin.left)
    .attr("cy", height / 2 + margin.top)

//RELIABLE
svg.append("circle")
    .attr("r", 5)
    .attr("cx", width / 2 + margin.left)
    .attr("cy", height / 2 + margin.top - radius / 4 - rect_width)

//TENATATIVE
svg.append("circle")
    .attr("r", 5)
    .attr("cx", width / 2 + margin.left)
    .attr("cy", height / 2 + margin.top + radius / 4 + rect_width)

//DETACHED
svg.append("circle")
    .attr("r", 5)
    .attr("cy", height / 2 + margin.top)
    .attr("cx", width / 2 + margin.left - radius / 4 - rect_width)

//HOPEFUL
svg.append("circle")
    .attr("r", 5)
    .attr("cy", height / 2 + margin.top)
    .attr("cx", width / 2 + margin.left + radius / 4 + rect_width)

//STUCK
svg.append("circle")
    .attr("r", 5)
    .attr("cx", width / 2 + margin.left - (Math.cos(Math.PI / 4) * (rect_width + radius / 4)))
    .attr("cy", height / 2 + margin.top - (Math.sin(Math.PI / 4) * (rect_width + radius / 4)))

//FRAYED
svg.append("circle")
    .attr("r", 5)
    .attr("cx", width / 2 + margin.left - (Math.cos(Math.PI / 4) * (rect_width + radius / 4)))
    .attr("cy", height / 2 + margin.top + (Math.sin(Math.PI / 4) * (rect_width + radius / 4)))

//FICKLE
svg.append("circle")
    .attr("r", 5)
    .attr("cx", width / 2 + margin.left + (Math.cos(Math.PI / 4) * (rect_width + radius / 4)))
    .attr("cy", height / 2 + margin.top + (Math.sin(Math.PI / 4) * (rect_width + radius / 4)))

//STRONG
svg.append("circle")
    .attr("r", 5)
    .attr("cx", width / 2 + margin.left + (Math.cos(Math.PI / 4) * (rect_width + radius / 4)))
    .attr("cy", height / 2 + margin.top - (Math.sin(Math.PI / 4) * (rect_width + radius / 4)))

//BROKEN
svg.append("circle")
    .attr("r", 5)
    .attr("cx", width / 2 + margin.left - (Math.cos(Math.PI / 4) * (rect_width + radius*.75)))
    .attr("cy", height / 2 + margin.top + (Math.sin(Math.PI / 4) * (rect_width + radius*.75)))

//ESTRANGED
svg.append("circle")
    .attr("r", 5)
    .attr("cx", width / 2 + margin.left - (Math.cos(Math.PI / 4) * (rect_width + radius*.75)))
    .attr("cy", height / 2 + margin.top - (Math.sin(Math.PI / 4) * (rect_width + radius*.75)))

//THRIVING
svg.append("circle")
    .attr("r", 5)
    .attr("cx", width / 2 + margin.left + (Math.cos(Math.PI / 4) * (rect_width + radius*.75)))
    .attr("cy", height / 2 + margin.top - (Math.sin(Math.PI / 4) * (rect_width + radius*.75)))

//SHALLOW
svg.append("circle")
    .attr("r", 5)
    .attr("cx", width / 2 + margin.left + (Math.cos(Math.PI / 4) * (rect_width + radius*.75)))
    .attr("cy", height / 2 + margin.top + (Math.sin(Math.PI / 4) * (rect_width + radius*.75)))

