var miniNodes = [
    {id: 0, actor: "Aaron Paul", show: "The Path", value: 36},
    {id: 1, actor: "Aaron Paul", show: "Big Love", value: 11},
    {id: 2, actor: "Aaron Paul", show: "Truth Be Told", value: 8},
    {id: 3, actor: "Aaron Paul", show: "Beverly Hills, 90210", value: 1},
    {id: 4, actor: "Aaron Paul", show: "Bones", value: 1},
    {id: 5, actor: "Elle Fanning", show: "Criminal Minds", value: 2}
];

var miniShows = [
    "The Path",
    "Big Love",
    "Truth Be Told",
    "Beverly Hills, 90210",
    "Bones",
    "Criminal Minds"
]

var miniStars = [
    "Aaron Paul",
    "Elle Fanning"
]


console.log(miniNodes);
console.log(miniShows);
console.log(miniStars);

//////////////////////////////////
//Creating star/show relationships for top half of matrix
//////////////////////////////////

var links = [];

for(var i = 0; i < miniNodes.length; i++) {
    for(var j = 0; j < miniStars.length; j++) {
        var starA = miniStars[j];
        if(starA === miniNodes[i].actor){
            links.push({source: starA, target: miniNodes[i].show, value: miniNodes[i].value})
        } else {
            links.push({source: starA, target: miniNodes[i].show, value: 0})
        }
    }
}
console.log(links);

//////////////////////////////////
//Creating star/show relationships for bottom half of matrix
//////////////////////////////////

var otherLinks = [];
    for(var i = 0; i < miniStars.length; i++) {
        for(var j = 0; j < miniNodes.length; j++) {
            var starA = miniStars[i];
            if(starA === miniNodes[j].actor){
                otherLinks.push({source: starA, target: miniNodes[j].show, value: miniNodes[j].value})
            } else {
                otherLinks.push({source: starA, target: miniNodes[j].show, value: 0})
            }
        }
    }
console.log(otherLinks);

//////////////////////////////////
//Awesome chunking function from https://ourcodeworld.com/articles/read/278/how-to-split-an-array-into-chunks-of-the-same-size-easily-in-javascript
//////////////////////////////////
function chunkArray(myArray, chunk_size){
    var index = 0;
    var arrayLength = myArray.length;
    var tempArray = [];
    
    for (index = 0; index < arrayLength; index += chunk_size) {
        myChunk = myArray.slice(index, index+chunk_size);
        tempArray.push(myChunk);
    }

    return tempArray;
}
// Split links for top half in groups, each with the length of the miniStars list
var colChunks = chunkArray(links, miniStars.length);
// Split links for bottom half in groups, each with the length of the miniShows list
var rowChunks = chunkArray(otherLinks, miniShows.length);
console.log(colChunks);
console.log(rowChunks);

var matrix = [];

// Top half of matrix, each row is the zero's following by the source-target values
    for(var i = 0; i < miniShows.length; i++) {
        var row = [];
            for(var j = 0; j < miniShows.length; j++) {
                row.push(0);
            }

            var rowLinks = colChunks[i];
            
            for(var j = 0; j < rowLinks.length; j++) {
                valA = rowLinks[j].value;
                row.push(valA);
            }
        matrix.push(row);
    }
    console.log(matrix);

// Bottom half of matrix, each row is the source-target values followed by the zero's
    for(var i = 0; i < miniStars.length; i++) {
        var row = [];

            var rowLinks = rowChunks[i];
            
            for(var j = 0; j < rowLinks.length; j++) {
                valA = rowLinks[j].value;
                row.push(valA);
            }

            for(var j = 0; j < miniStars.length; j++) {
                row.push(0);
            }
        matrix.push(row);
    }
    console.log(matrix);

