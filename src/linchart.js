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
    let y = d3.scaleLinear()
        .domain([0, d3.max(data, function (d) {
            return +d.value;
        })])
        .range([height, 0]);
    let yAxis = svg.append("g")
        .call(d3.axisLeft(y));

    // Add a clipPath: everything out of this area won't be drawn.
    let clip = svg.append("defs").append("svg:clipPath")
        .attr("id", "clip")
        .append("svg:rect")
        .attr("width", width)
        .attr("height", height)
        .attr("x", 0)
        .attr("y", 0);

    //Add brushing
    let brush = d3.brushX()                   // Add the brush feature using the d3.brush function
        .extent([[0, 0], [width, height]])  // initialise the brush area: start at 0,0 and finishes at width,height: it means I select the whole graph area
        .on("end", updateChart);               // Each time the brush selection changes, trigger the 'updateChart' function

    // Create the line variable: where both the line and the brush take place
    let line = svg.append('g')
        .attr("clip-path", "url(#clip)");

    // Add the line
    yKeys.forEach(function (key) {
        line.append("path")
            .datum(data)
            .attr("class", `link_${key}`)
            .attr("fill", "none")
            .attr("stroke", "steelblue")
            .attr("stroke-width", 1.5)
            .attr("d", d3.line()
                .x(function (d) {
                    return x(d[xKey])
                })
                .y(function (d) {
                    return y(d.value)
                })
            );
    });

    // Add the brushing
    line
        .append("g")
        .attr("class", "brush")
        .call(brush);

    // A function that set idleTimeOut to null
    let idleTimeout;

    function idled() {
        idleTimeout = null;
    }

    // A function that update the chart for given boundaries
    function updateChart() {

        // What are the selected boundaries?
        let extent = d3.event.selection;
        // If no selection, back to initial coordinate. Otherwise, update X axis domain
        if (extent) {
            x.domain([x.invert(extent[0]), x.invert(extent[1])]);
            line.select(".brush").call(brush.move, null) // This remove the grey brush area as soon as the selection has been done
        }

        // Update axis and line position
        xAxis.transition().duration(1000).call(d3.axisBottom(x));
        yKeys.forEach(function (key) {
            line
                .select(`.line_${key}`)
                .transition()
                .duration(1000)
                .attr("d", d3.line()
                    .x(function (d) {
                        return x(d[xKey])
                    })
                    .y(function (d) {
                        return y(d[key])
                    })
                )
        });

    }

    // If user double click, reinitialize the chart
    svg.on("dblclick", function () {
        x.domain(d3.extent(data, function (d) {
            return d[xKey];
        }));
        xAxis.transition().call(d3.axisBottom(x));
        yKeys.forEach(function (key) {
            debugger
            line
                .select(`.line_${key}`)
                .transition()
                .duration(1000)
                .attr("d", d3.line()
                    .x(function (d) {
                        return x(d[xKey])
                    })
                    .y(function (d) {
                        return y(d[key])
                    })
                )
        });
    });
}

export default LineChart;
