const miniData = [
    {
        id: "a",
        color: "red",
        value: 11
    },
    {
        id: "b",
        color: "blue",
        value: 10
    },
    {
        id: "c",
        color: "green",
        value: 8
    }
]

const gridHeight = 4;
let expandedData = [];
for (let i = 0; i < miniData.length; i++) {
    // if (i == 0) {
    //     for (let j = 0; j < miniData[i].value; j++) {
    //         if (j < gridHeight) {
    //             expandedData.push({
    //                 id: miniData[i].id,
    //                 color: miniData[i].color,
    //                 x: 0,
    //                 y: j
    //             })
    //         } else {
    //             expandedData.push({
    //                 id: miniData[i].id,
    //                 color: miniData[i].color,
    //                 x: 1,
    //                 y: j - gridHeight
    //             })
    //         }
    //     }
    // }
    if (i == 0) {
        for(let m = 0; m < gridHeight; m++) {
            for (let j = m; j < miniData[i].value; j += 4) {
                expandedData.push({
                    id: miniData[i].id,
                    color: miniData[i].color,
                    y: m
                })
            }
        }
    }

    // let remainder;
    // if (i == 0) {
    //     remainder = miniData[i].value % gridHeight;
    // }

}
console.log(expandedData)