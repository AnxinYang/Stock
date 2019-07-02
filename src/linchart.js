import * as d3 from "d3";

const COLORS = [
    '#0088FE',
    '#ff3f34',
    '#b71540',
    '#00C49F',
    '#FFBB28',
    '#FF8042',
    '#1e90ff',
    '#2ed573',
    '#ffa502',
    '#ff7f50',
    '#4a69bd',
    '#079992',
    '#82ccdd',
    '#e55039',
    '#3867d6',
    '#8854d0',
    '#05c46b',
    '#3c40c6',
    '#ff3f34',
    '#ffa801',
    '#6D214F',

];

function LineChart(options = {}) {
    let {containerId, data, margin, yKeys, xKey, control,} = options;
    let container = cc.select('#' + containerId);
    // Clean container.
    container.removeAllChildren();

    // Setup options.
    let _margin = Object.assign({top: 10, right: 30, bottom: 30, left: 60}, margin || {});
    let {height, width} = container.getBoundingClientRect();
    height = height - _margin.top - _margin.bottom;
    width = width - _margin.right - _margin.left;

    // Setup SVG
    let svg = d3.select('#' + containerId)
        .append("svg")
        .attr("width", width + _margin.left + _margin.right)
        .attr("height", height + _margin.top + _margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + _margin.left + "," + _margin.top + ")");

    // Add X axis
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

    // Add clip path
    let clip = svg.append("defs").append("svg:clipPath")
        .attr("id", "clip")
        .append("svg:rect")
        .attr("width", width)
        .attr("height", height)
        .attr("x", 0)
        .attr("y", 0);

    // Setup line generator
    let line = svg.append('g')
        .attr("clip-path", "url(#clip)");
    let lineGenerator = function (key) {
        return d3.line()
            .x(function (d) {
                return x(d[xKey]);
            })
            .y(function (d) {
                return y(+d[key]);
            });
    };

    // Add the line
    yKeys.forEach(function (key, idx) {
        line.append("path")
            .datum(data)
            .attr("class", "line_" + key)
            .attr("fill", "none")
            .attr("stroke", COLORS[idx])
            .attr("stroke-width", 1.5)
            .attr("d", lineGenerator(key));
    });

    // Setup tooltip
    svg.on("wheel", function (e) {
        d3.event.preventDefault();
        let clientX = d3.event.clientX;
        let direction = d3.event.wheelDelta < 0 ? 'down' : 'up';
        debugger;
    })
        .on("mouseout", function () {

        })
        .on("mousemove", function () {
            let self = this;
            if (data && data.length > 0) {
                let clientX = d3.event.clientX;
                let clientY = d3.event.clientY;
                let x0 = x.invert(d3.mouse(self)[0]),
                    i = d3.bisector(function (d) {
                        return d[xKey];
                    }).left(data, x0, 1),
                    d0 = data[i - 1],
                    d1 = data[i];

                let d = d0;

                if (d1) {
                    d = x0 - d0[xKey] > d1[xKey] - x0 ? d1 : d0;
                }
                console.log(d)
            }
        });

    // Setup controller
    control === 'brush' ? setupBrush() : setupZoom();

    function setupBrush() {
        let brush = d3.brushX()
            .extent([[0, 0], [width, height]])
            .on("end", updateChart);

        line
            .append("g")
            .attr("class", "brush")
            .call(brush);

        function updateChart() {
            let extent = d3.event.selection;

            if (extent) {
                x.domain([x.invert(extent[0]), x.invert(extent[1])]);
                line.select(".brush").call(brush.move, null);
            }

            xAxis.transition().duration(1000).call(d3.axisBottom(x));
            yKeys.forEach(function (key) {
                line
                    .select('.line_' + key)
                    .transition()
                    .duration(1000)
                    .attr("d", lineGenerator(key));
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
                    .attr("d", lineGenerator(key));
            });

        });
    }


    function setupZoom() {
        let zoom = d3.zoom()
            .scaleExtent([1, 32])
            .translateExtent([[0, 0], [width, height]])
            .extent([[0, 0], [width, height]])
            .on("zoom", zoomed);

        svg.append("rect")
            .attr("class", "zoom")
            .attr("width", width)
            .attr("height", height)
            //.attr('fill', 'transparent')
            .call(zoom);

        function zoomed() {
            //if (d3.event.sourceEvent && d3.event.sourceEvent.type === "brush") return;
            let t = d3.event.transform;
            let xt = t.rescaleX(x);
            //x.domain(xt.domain());
            yKeys.forEach(function (key) {
                line
                    .select(`.line_${key}`)
                    .attr("d", lineGenerator(key).x(function (d) {
                        return xt(d[xKey]);
                    }));
            });
            xAxis.call(d3.axisBottom(xt));
        }
    }


}

export default LineChart;
