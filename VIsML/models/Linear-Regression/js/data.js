var feature_names;
var whole_data_set = [];
var all_data = [];
var all_target = [];
var selected_feature_indeces = [];
// 获取数据
async function readData(url) {
    const csvDataset = tf.data.csv(
        '../datasets/' + url, {
            csvConfig: {
                hasHeader: true
            }
        });
    const dataset = await csvDataset.toArray();
    // console.log(dataset);
    return dataset;
}
async function showData(url, name) {
    // 模糊背景，弹出加载动画
    document.getElementById("main").style.filter = "blur(7px)"; // 模糊背景
    document.getElementById("main").style.zIndex = "-1"; // 背景图层后撤
    document.getElementById("loading").style.display = "block"; // 显现加载条
    document.getElementById("table-title").innerText = name; // 显现数据集的标题
    document.getElementById("available_dataset").dataset.filename = url; // 保存文件路径在标签中，供后面使用

    // 获取数据
    const dataset = await readData(url);

    // 从数据集中获得所有值
    const data = [];
    for (let i = 0; i < dataset.length; i++) {
        data.push(Object.values(dataset[i]));
    }

    // 从数据集中获取所有特征
    feature_names = Object.keys(dataset[0]);

    showFeatureAndLabelSelectionBox(feature_names);
    // 创建表头，插入特征值
    let thead = document.createElement("thead");
    let tr = document.createElement("tr");
    for (let i in feature_names) {
        let th = document.createElement("th");
        th.innerText = feature_names[i];
        tr.appendChild(th);
    }
    document.querySelector("#datatable").appendChild(thead);
    thead.appendChild(tr);


    // DataTables渲染到数据表格标签
    // $(document).ready(function () {
    var table = $('#datatable').DataTable({
        data: data,
        scrollX: "200px",
        language: {
            url: "../../assets/css/language_cn.json"
        },

    });
    // });



    // 表格渲染完毕后再等待1秒
    setTimeout("stopLoading()", 1000);

    // 切换到查看数据标签
    document.getElementById("tab-1").className = "tab-pane fade";
    document.getElementById("select-tab").className = "nav-link";
    document.getElementById("view-tab").className = "nav-link active";
    document.getElementById("tab-2").className = "tab-pane fade show active";
    // console.log(features.length);

    // 渲染数据信息表格
    // 表头
    let info_tr = document.createElement("tr");
    let desc_th = document.createElement("th");
    info_tr.appendChild(desc_th);
    for (let feature_index in feature_names) {
        let th = document.createElement("th");
        th.innerText = feature_names[feature_index];
        info_tr.appendChild(th);
    }
    document.querySelector("#data_info").appendChild(info_tr);

    // 平均值
    let mean_tr = document.createElement("tr");
    let mean_th = document.createElement("th");
    mean_th.innerText = "Mean";
    mean_tr.appendChild(mean_th)
    for (let feature_index in feature_names) {
        let th = document.createElement("th");
        var mean_value = table.column(feature_index).data().average();
        th.innerText = mean_value;
        mean_tr.appendChild(th);
        // console.log(value_array);
    }
    document.querySelector("#data_info").appendChild(mean_tr);

    // 最大值
    let max_tr = document.createElement("tr");
    let max_th = document.createElement("th");
    max_th.innerText = "Max";
    max_tr.appendChild(max_th)
    for (let feature_index in feature_names) {
        let th = document.createElement("th");
        var max_value = table.column(feature_index).data().sort().reverse()[0];
        th.innerText = max_value;
        max_tr.appendChild(th);
        // console.log(value_array);
    }
    document.querySelector("#data_info").appendChild(max_tr);

    // 最小值
    let min_tr = document.createElement("tr");
    let min_th = document.createElement("th");
    min_th.innerText = "Min";
    min_tr.appendChild(min_th)
    for (let feature_index in feature_names) {
        let th = document.createElement("th");
        var min_value = table.column(feature_index).data().sort()[0];
        th.innerText = min_value;
        min_tr.appendChild(th);
        // console.log(value_array);
    }
    document.querySelector("#data_info").appendChild(min_tr);
    // const value_array = table.column('X').data();
    // console.log(Math.max(...value_array))
    // const myArray = [2, 3, 1];
    // console.log(value_array);
    // console.log(Math.min(...value_array));
    // console.log(table.column(0).data());
    // feature_count = []
    // for (let i in data) {
    //     data[i][""]
    // }
}


function showFeatureAndLabelSelectionBox(column_names) {
    const num_of_features = column_names.length;
    // 特征多选表单
    let form = document.createElement("form");
    // form.className = "form-check square-check";
    form.method = "post";
    for (i = 0; i < num_of_features; i++) {
        // console.log(column_names[i]);
        let div_ = document.createElement("div");
        // div_.className = "form-check";
        let input_bar = document.createElement("input");
        input_bar.className = "form-check-input";
        input_bar.type = "checkbox";
        input_bar.value = i;
        input_bar.id = "input-" + i;
        input_bar.checked = "true";
        let label = document.createElement("label");
        label.className = "form-check-label";
        label.innerText = column_names[i];
        label.for = "defaultCheck" + i;
        form.appendChild(div_);
        div_.appendChild(input_bar);
        div_.appendChild(label);
    }

    document.querySelector("#feature_selection_box ").appendChild(form);

    //标签选择
    for (let i = 0; i < num_of_features; i++) {
        // console.log(selected_feature_indeces[i]);
        let option = document.createElement("option");
        // console.log(selected_feature_indeces[i]);
        // option.value = selected_feature_indeces[i];
        option.value = i;
        option.innerText = column_names[i];
        document.querySelector("#label_selection_box").appendChild(option);
        // document.querySelector("#selection_two").appendChild(option);
    }

}

// DataTable生成后，停止加载的函数
function stopLoading() {
    document.getElementById("main").style.filter = ""; // 取消背景模糊
    document.getElementById("main").style.zIndex = "1";
    document.getElementById("loading").style.display = "none"; // 隐藏加载条
}

// 如果选取数据后再点击”选择数据“标签，弹窗提示是否确认
function rechooseData() {
    if (document.getElementById("datatable")) {

        document.getElementById("main").style.filter = "blur(7px)"; //背景模糊
        document.getElementById("main").style.zIndex = "-1";
        document.getElementById("modal-default").style.display = "block"; // 展现弹窗

    }
}
// 取消重选
function cancelRechoose() {
    document.getElementById("main").style.filter = ""; // 关闭背景模糊
    document.getElementById("main").style.zIndex = "1";
    document.getElementById("modal-default").style.display = "none"; // 隐藏弹窗提示
    // 切换标签回到”查看数据“
    document.getElementById("tab-1").className = "tab-pane fade";
    document.getElementById("select-tab").className = "nav-link";
    document.getElementById("view-tab").className = "nav-link active";
    document.getElementById("tab-2").className = "tab-pane fade show active";
}


// 特征选择
document.getElementById("feature_select").onclick = function () {
    selectFeatures();
}
async function selectFeatures() {
    // 获取数据
    url = document.getElementById("available_dataset").dataset.filename;
    const dataset = await readData(url);
    // 从数据集中获得所有值

    for (let i = 0; i < dataset.length; i++) {
        whole_data_set.push(Object.values(dataset[i]));
    }
    // console.log(data);

    // 获取选中的特征索引
    var feature_box = document.forms[0];

    // 如果有特征被选中，该特征的索引加入数组中，默认全部选中
    for (let i = 0; i < feature_box.length; i++) {
        if (feature_box[i].checked) {
            selected_feature_indeces.push(i);
        }
    }


    // 建立数据集数组
    // const all_data = []
    for (let i in whole_data_set) {
        var features = []
        // let k = 0;
        for (let feature_index in selected_feature_indeces) {
            features.push(whole_data_set[i][selected_feature_indeces[feature_index]])

            // k = k + 1;
        }
        all_data.push(features);
    }
    console.log(all_data);


    // 获取选中的标签
    var label_selected_index = parseInt(document.getElementById("label_selection_box").value);
    selected_feature_indeces.push(label_selected_index)
    for (let i in whole_data_set) {
        all_target.push(whole_data_set[i][label_selected_index])
    }

    console.log(all_target);
    // console.log(selected_feature_indeces);
    alert("选取成功")
    console.log(selected_feature_indeces);
    // 选取特征画关系图
    // console.log(selected_feature_indeces);
    // 插入单选框HTML

    // form.className = "form-check square-check";
    for (let i = 0; i < selected_feature_indeces.length; i++) {
        // console.log(selected_feature_indeces[i]);
        let option = document.createElement("option");
        // console.log(selected_feature_indeces[i]);
        // option.value = selected_feature_indeces[i];
        option.value = selected_feature_indeces[i];
        option.innerText = feature_names[selected_feature_indeces[i]];
        document.querySelector("#selection_one").appendChild(option);
        // document.querySelector("#selection_two").appendChild(option);
    }

    for (let i = 0; i < selected_feature_indeces.length; i++) {
        // console.log(selected_feature_indeces[i]);
        let option = document.createElement("option");
        // console.log(selected_feature_indeces[i]);
        option.value = selected_feature_indeces[i];
        option.innerText = feature_names[selected_feature_indeces[i]];
        // document.querySelector("#selection_one").appendChild(option);
        document.querySelector("#selection_two").appendChild(option);
    }



    // document.querySelector("#feature_selection_box ").appendChild(form);
}


document.getElementById("plotFeatures").onclick = function () {
    // console.log(document.getElementById("selection_one").value);
    const index_one = document.getElementById("selection_one").value;
    const index_two = document.getElementById("selection_two").value;
    console.log(index_one);
    console.log(index_two);
    const text_one = feature_names[index_one];
    const text_two = feature_names[index_two];
    const data_one = [];
    const data_two = [];
    for (let i in whole_data_set) {
        data_one.push(whole_data_set[i][index_one])
    }

    for (let i in all_data) {
        data_two.push(whole_data_set[i][index_two])
    }
    // console.log(data_one);
    // console.log(data_two);
    plot_feature_relationship(data_one, data_two, text_one, text_two);

}


function plot_feature_relationship(data_one, data_two, text_one, text_two) {
    // var xArray = [50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150];
    // var yArray = [7, 8, 8, 9, 9, 9, 10, 11, 14, 14, 15];

    var data = [{
        type: 'scatter',
        x: data_one,
        y: data_two,
        mode: "markers",
        paper_bgcolor: "red"
    }];

    // Define Layout
    var layout = {
        xaxis: {

            title: text_one
        },
        yaxis: {

            title: text_two
        },
        // title: "House Prices vs. Size"
        paper_bgcolor : 'rgba(0,0,0,0)',
        plot_bgcolor : 'rgba(0,0,0,0)',
    };

    Plotly.newPlot("myPlot", data, layout);
}

var rangeSlider = function(){
    var slider = $('.range-slider'),
        range = $('.range-slider__range'),
        value = $('.range-slider__value');
      
    slider.each(function(){
  
      value.each(function(){
        var value = $(this).prev().attr('value');
        $(this).html(value);
      });
  
      range.on('input', function(){
        $(this).next(value).html(this.value);
      });
    });
  };
  
  rangeSlider();