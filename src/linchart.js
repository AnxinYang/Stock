import * as d3 from "d3";

function LineChart(options = {}) {
    let {containerId, data, margin, yKeys, xKey} = options;
    let container = cc.select('#' + containerId);
    container.removeAllChildren();
    let _margin = Object.assign({top: 10, right: 30, bottom: 30, left: 60}, margin || {});
    let {height, width} = container.getBoundingClientRect();
    height = height - _margin.top - _margin.bottom;
    width = width - _margin.right - _margin.left;

    let svg = d3.select('#' + containerId)
        .append("svg")
        .attr("width", width + _margin.left + _margin.right)
        .attr("height", height + _margin.top + _margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + _margin.left + "," + _margin.top + ")");

    let x = d3.scaleTime()
        .domain(d3.extent(data, function (d) {
            return d[xKey];
        }))
        .range([0, width]);
    let xAxis = svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    // Add Y axis
    let dataMax;
    let dataMin;
    yKeys.forEach(function (key) {
        let setMax = d3.max(data, function (d) {
            return +d[key];
        });
        let setMin = d3.min(data, function (d) {
            return +d[key];
        });
        if (dataMax) {
            dataMax = Math.max(dataMax, setMax);
        } else {
            dataMax = setMax;
        }
        if (dataMin) {
            dataMin = Math.min(dataMin, setMin);
        } else {
            dataMin = setMin;
        }
    });
    let y = d3.scaleLinear()
        .domain([dataMin, dataMax])
        .range([height, 0]);
    let yAxis = svg.append("g")
        .call(d3.axisLeft(y));


    let clip = svg.append("defs").append("svg:clipPath")
        .attr("id", "clip")
        .append("svg:rect")
        .attr("width", width)
        .attr("height", height)
        .attr("x", 0)
        .attr("y", 0);


    let brush = d3.brushX()
        .extent([[0, 0], [width, height]])
        .on("end", updateChart);


    let line = svg.append('g')
        .attr("clip-path", "url(#clip)");

    // Add the line
    yKeys.forEach(function (key) {
        line.append("path")
            .datum(data)
            .attr("class", "line_"+ key)
            .attr("fill", "none")
            .attr("stroke", "steelblue")
            .attr("stroke-width", 1.5)
            .attr("d", d3.line()
                .curve(d3.curveMonotoneX)
                .x(function (d) {
                    return x(d[xKey]);
                })
                .y(function (d) {
                    return y(+d[key]);
                })
            );
    });

    line
        .append("g")
        .attr("class", "brush")
        .call(brush);

    let idleTimeout;

    function idled() {
        idleTimeout = null;
    }

    function updateChart() {
        let extent = d3.event.selection;

        if (extent) {
            x.domain([x.invert(extent[0]), x.invert(extent[1])]);
            line.select(".brush").call(brush.move, null);
        }

        xAxis.transition().duration(1000).call(d3.axisBottom(x));
        yKeys.forEach(function (key) {
            line
                .select('.line_'+key)
                .transition()
                .duration(1000)
                .attr("d", d3.line()
                    .curve(d3.curveMonotoneX)
                    .x(function (d) {
                        return x(d[xKey])
                    })
                    .y(function (d) {
                        return y(+d[key]);
                    })
                )
        })
    }

    svg.on("dblclick", function () {
        x.domain(d3.extent(data, function (d) {
            return d[xKey];
        }));
        xAxis.transition().call(d3.axisBottom(x));
        yKeys.forEach(function (key) {
            line
                .select(`.line_${key}`)
                .transition()
                .attr("d", d3.line()
                    .curve(d3.curveMonotoneX)
                    .x(function (d) {
                        return x(d[xKey])
                    })
                    .y(function (d) {
                        return y(+d[key]);
                    })
                )
        });

    });
}

export default LineChart;
