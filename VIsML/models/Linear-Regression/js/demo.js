// async function readData(url) {
//     const csvDataset = tf.data.csv(
//         './datasets/' + url, {
//         csvConfig: {
//             hasHeader: true
//         }
//     });
//     const dataset = await csvDataset.toArray();
//     return dataset;
//     //  console.log(dataset);
// }
// async function lr() {
//     const results = await readData("forest_fires.csv");
//     const labels = [];
//     // console.log("result: ", results)
//     console.log(Object.values(results[2]["temp"]));
//     for (let i = 0; i < results.length; i++){
//         labels.push(Object.values(results[i]['area']));
//     }
//     // const labels = results[0];
//     console.log("labels: ", labels)
//     // console.log(results)
//     // delete results.area; 
//     // console.log(results);
//     // const features = [];
//     // for (let i = 0; i < results.length; i++) {

//     //         data.push(Object.values(results[i]));
        
//     // }
//     // console.log(data,Object.keys(results[0]))
    
// }
// lr();
