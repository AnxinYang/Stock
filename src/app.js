import cc from 'npm-ccjs-ay';
import * as d3 from "d3";

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
    let root = cc.select('#body');
    let mainContainer = cc.createElement('div', 'main')
        .addClass('main-container');
    root.appendChild(mainContainer);
};


index();