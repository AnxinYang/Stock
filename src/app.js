import cc from 'npm-ccjs-ay';
import * as d3 from "d3";
import apis from './apis';
import LineChart from './linchart';
import utils from './utils';

function index() {
    index.env();
    index.root();

}


index.env = function (){
    cc.setValue('viewport', {width: window.innerWidth, height: window.innerHeight});
    window.addEventListener('resize', function () {
        cc.updateValue('viewport', {width: window.innerWidth, height: window.innerHeight});
    });

};

index.root = function () {
    // d3.csv("https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/3_TwoNumOrdered_comma.csv",
    //
    //     // When reading the csv, I must format variables:
    //     function (d) {
    //         return {date: d3.timeParse("%Y-%m-%d")(d.date), value: d.value}
    //     }).then(  // Now I can use this dataset:
    //     function (data) {
    //         cc.setValue('data', data);
    //     });
    let mainContainer = cc.select('#body').add('div', 'main')
        .addClass('main-container')
        .css({
            height: '100vh',
            width: '100vw',
        })
        .memory({
            renderChart: function (d) {
                LineChart({
                    containerId: 'main',
                    data: d || cc.getValue('data') || [],
                    xKey: 'date',
                    yKeys: ['close']
                })
            }
        })
        .bind('viewport', function (d, memory) {
            memory.renderChart()
        })
        .bind('data', function (d, memory) {
            memory.renderChart(d)
        });

    apis.getIntraDay('GRPN',{
        interval: '1min',
        //outputsize: 'full',
    })
        .then(function (json) {

            let timeSeries = {};
            let data = []
            cc.utils.objectforEach(json, function (item, key, obj) {
                if(key.indexOf('Time')>-1){
                    timeSeries = item;
                }
            });
            cc.utils.objectforEach(timeSeries, function (item, key, obj) {
                // let d = Object.assign({}, item,{date: d3.timeParse("%Y-%m-%d %H:%M:%S")(key)});
                let d = {
                    date: d3.timeParse("%Y-%m-%d %H:%M:%S")(key),
                    close: item['4. close']
                };
                data.push(d);
            });
            cc.setValue('data', data);
        });

};


index();