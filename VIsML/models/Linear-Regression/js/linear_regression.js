// 加载所有特征与标签数据

async function loadData(file_name) {

    // const training_data = tf.data.csv("./datasets/house_data.csv");
    const csvDataset = tf.data.csv(
        '../datasets/' + file_name, {
            columnConfigs: {
                price: {
                    isLabel: true
                }
            }
        });

    const converted_data = csvDataset.map(({
        xs,
        ys
    }) => {

        const labels = [ys.price]
        return {
            xs: Object.values(xs),
            ys: Object.values(ys)
        }
    });

    // const dataset = await training_data.toArray();
    // console.log(dataset);

    // 提取所有特征值
    const points = await converted_data.take(1000).toArray();


    const featureValues = points.map(data => data.xs);

    // alert(featureTensor);
    // 提取所有标签值
    const labelValues = points.map(data => data.ys);

    // console.log(featureTensor.print());

    // console.log(normalisedFeatureTensor.print());
    const data_array = {
        "featureValues": featureValues,
        "labelValues": labelValues
    }
    // console.log(data_array["normalisedFeatureTensor"]);
    return data_array;

}

document.getElementById("feature_select").onclick = function () {
    showFeatureSelectionBox()
}
// 特征选择
async function showFeatureSelectionBox() {
    // 获取表单
    var feature_box = document.forms[0];
    // 创建表示选中特征的数组
    var selected_feature_names = [];
    const data = await loadData(document.getElementById("available_dataset").dataset.filename);
    const all_features = data["featureValues"];
    const selected_labels = data["labelValues"];
    var i;
    // 如果有特征被选中，该特征的索引加入数组中，默认全部选中
    for (i = 0; i < feature_box.length; i++) {
        if (feature_box[i].checked) {
            selected_feature_names.push(i);
        }
    }
    // const data = await loadData();

    // const all_features = data["featureValues"];
    // console.log(all_features);
    // console.log(all_features);
    // 加载所有数据
    var features = [];

    // console.log(all_features);
    console.log(selected_feature_names);
    all_features.forEach((value, index) => {
        var temp = [];
        // for (var feature in selected_feature_names) {
        selected_feature_names.forEach((v, i) => {
            temp.push(all_features[index][v]);
        })
        // }
        features.push(temp);

    });

    console.log(features);
    selected_data = {
        "selected_features": features,
        "selected_labels": selected_labels
    }
    console.log(selected_data);
    return selected_data;
}
var selected_data = {};
var training_set = {};


// const feature_values = 




// console.log(selected_features);
// const featureTensor = tf.tensor(selected_features, [selected_features.length, selected_features[1].length]);
// console.log(featureTensor);


document.getElementById("norm_and_regu").onclick = function () {
    normAndRegu()
}

function normAndRegu() {
    const selected_features = selected_data["selected_features"];
    const selected_labels = selected_data["selected_labels"];
    const featureTensor = tf.tensor(selected_features, [selected_features.length, selected_features[1].length]);
    const labelTensor = tf.tensor(selected_labels, [selected_labels.length, selected_labels[0].length]);
    var select_box = document.getElementById("norm_select");
    var index = select_box.selectedIndex;
    var val = select_box.options[index].value;

    if (val == "min_max") {
        const normalisedFeatureTensor = minMaxNormailze(featureTensor);
        const normalisedLabelTensor = minMaxNormailze(labelTensor);
        console.log(normalisedFeatureTensor.print());
        console.log(normalisedLabelTensor.print());
        training_set = {
            "normalisedFeatureTensor": normalisedFeatureTensor,
            "normalisedLabelTensor": normalisedLabelTensor
        }

        console.log(training_set);
        return training_set
    }
}
document.getElementById("start").onclick = function () {
    // console.log(training_set["normalisedFeatureTensor"].print());
    train(training_set["normalisedFeatureTensor"], training_set["normalisedLabelTensor"]);
}

// 归一化
function minMaxNormailze(tensor) {
    const min = tensor.min();
    const max = tensor.max();
    const nomarlisedTensor = tensor.sub(min).div(max.sub(min));
    return nomarlisedTensor;
}
// 创建模型
function createModel() {
    // Create a sequential model
    const model = tf.sequential();

    // Add a single input layer
    model.add(tf.layers.dense({
        inputShape: [2],
        units: 1,
        activation: "linear",
        useBias: true
    }));

    // Add an output layer
    model.add(tf.layers.dense({
        units: 1,
        useBias: true
    }));

    return model;
}


async function train(features, labels) {
    const surface = tfvis.visor().surface({
        name: '训练损失变化',
        tab: 'My Tab'
    });
    // const {
    //     onBatchEnd,
    //     onEpochEnd
    // } = tfvis.show.fitCallbacks({
    //         name: "Training Performance"
    //     },
    //     ['loss']
    // )
    // Create the model
    const model = createModel();
    // tfvis.show.modelSummary({
    //     name: 'Model Summary'
    // }, model);
    model.compile({
        loss: 'meanSquaredError',
        optimizer: tf.train.sgd(0.01)
    });
    const history = [];
    await model.fit(features, labels, {
        batchSize: 1,
        epochs: 100,

        callbacks: {
            onEpochEnd: (epoch, log) => {
                history.push(log);
                tfvis.show.history(surface, history, ['loss']);
            }
        }


    })

}
// const dataset = loadData();
// console.log(dataset);
// train(dataset, 100);
function evaluate(features, labels) {
    const model = tf.sequential({
        layers: [tf.layers.dense({
            units: 1,
            inputShape: [2]
        })]
    });
    model.compile({
        optimizer: 'sgd',
        loss: 'meanSquaredError'
    });
    const result = model.evaluate(features, labels, {
        batchSize: 32,
    });
    result.print();
}