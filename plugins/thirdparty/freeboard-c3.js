(function() {

    freeboard.loadWidgetPlugin({
        "type_name": "C3",
        "display_name": "C3 Widget",
        "description": "Very simple and basic wrapper around C3, which is a wrapper around D3 for each reusable graphs.",
        "external_scripts": [
            "https://cdnjs.cloudflare.com/ajax/libs/d3/3.5.16/d3.min.js",
            "https://cdnjs.cloudflare.com/ajax/libs/c3/0.4.10/c3.min.js"
        ],
        "fill_size": true,
        "settings": [{
            "name": "type",
            "display_name": "Type",
            "type": "option",
            "options": [{
                "name": "Line",
                "value": "line"
            }, {
                "name": "Spline",
                "value": "spline"
            }, {
                "name": "Area",
                "value": "area"
            }, {
                "name": "Area-Spline",
                "value": "area-spline"
            }, {
                "name": "Step",
                "value": "step"
            }, {
                "name": "Area-Step",
                "value": "area-step"
            }, {
                "name": "Gauge",
                "value": "gauge"
            }, {
                "name": "Bar",
                "value": "bar"
            }, {
                "name": "Scatter",
                "value": "scatter"
            }, {
                "name": "Pie",
                "value": "pie"
            }, {
                "name": "Donut",
                "value": "donut"
            }]
        }, {
            "name": "data",
            "display_name": "Chart Data",
            "type": "calculated",
            "description": "C3 Data JSON used with the c3.load and c3.flow methods"
        }, {
            "name": "options",
            "display_name": "Chart Options",
            "type": "calculated",
            "description": "C3 options JSON used to configure the graph"
        }, {
            "name": "flow",
            "display_name": "Append Data",
            "type": "boolean",
            "default_value": false,
            "description": "Use c3.flow to append data rather than replacing all of the data"
        }, {
            "name": "height",
            "display_name": "Height Blocks",
            "type": "number",
            "default_value": 5,
            "description": "A height block is around 60 pixels"
        }],
        newInstance: function(settings, newInstanceCallback) {
            newInstanceCallback(new freeboardC3Widget(settings));
        }

    });

    // c3 css styles
    freeboard.addStyle('.c3 svg', "font: 10px sans-serif;");
    freeboard.addStyle('.c3 path, .c3 line', "fill: none; stroke: #000;");
    freeboard.addStyle('.c3 text', "-webkit-user-select: none; -moz-user-select: none; user-select: none;");
    freeboard.addStyle('.c3-legend-item-tile, .c3-xgrid-focus, .c3-ygrid, .c3-event-rect, .c3-bars path', "shape-rendering: crispEdges;");
    freeboard.addStyle('.c3-chart-arc path', "stroke: #fff;");
    freeboard.addStyle('.c3-chart-arc text', "fill: #fff; font-size: 13px;");
    freeboard.addStyle('.c3-grid line', "stroke: #aaa;");
    freeboard.addStyle('.c3-grid text', "fill: #aaa;");
    freeboard.addStyle('.c3-xgrid, .c3-ygrid', "stroke-dasharray: 3 3;");
    freeboard.addStyle('.c3-text.c3-empty', "fill: #808080; font-size: 2em;");
    freeboard.addStyle('.c3-line', "stroke-width: 1px;");
    freeboard.addStyle('.c3-circle._expanded_', "stroke-width: 1px; stroke: white;");
    freeboard.addStyle('.c3-selected-circle', "fill: white; stroke-width: 2px;");
    freeboard.addStyle('.c3-bar', "stroke-width: 0;");
    freeboard.addStyle('.c3-bar._expanded_', "fill-opacity: 0.75;");
    freeboard.addStyle('.c3-target.c3-focused', "opacity: 1;");
    freeboard.addStyle('.c3-target.c3-focused path.c3-line, .c3-target.c3-focused path.c3-step', "stroke-width: 2px;");
    freeboard.addStyle('.c3-target.c3-defocused', "opacity: 0.3 !important;");
    freeboard.addStyle('.c3-region', "fill: steelblue; fill-opacity: 0.1;");
    freeboard.addStyle('.c3-brush .extent', "fill-opacity: 0.1;");
    freeboard.addStyle('.c3-legend-item', "font-size: 12px;");
    freeboard.addStyle('.c3-legend-item-hidden', "opacity: 0.15;");
    freeboard.addStyle('.c3-legend-background', "opacity: 0.75; fill: white; stroke: lightgray; stroke-width: 1;");
    freeboard.addStyle('.c3-tooltip-container', "z-index: 10;");
    freeboard.addStyle('.c3-tooltip', "border-collapse: collapse; border-spacing: 0; background-color: #fff; empty-cells: show; -webkit-box-shadow: 7px 7px 12px -9px #777777; -moz-box-shadow: 7px 7px 12px -9px #777777; box-shadow: 7px 7px 12px -9px #777777; opacity: 0.9;");
    freeboard.addStyle('.c3-tooltip tr', "border: 1px solid #CCC;");
    freeboard.addStyle('.c3-tooltip th', "background-color: #aaa; font-size: 14px; padding: 2px 5px; text-align: left; color: #FFF;");
    freeboard.addStyle('.c3-tooltip td', "font-size: 13px; padding: 3px 6px; background-color: #fff; border-left: 1px dotted #999;");
    freeboard.addStyle('.c3-tooltip td > span', "display: inline-block; width: 10px; height: 10px; margin-right: 6px;");
    freeboard.addStyle('.c3-tooltip td.value', "text-align: right;");
    freeboard.addStyle('.c3-area', "stroke-width: 0; opacity: 0.2;");
    freeboard.addStyle('.c3-chart-arcs-title', "dominant-baseline: middle; font-size: 1.3em;");
    freeboard.addStyle('.c3-chart-arcs .c3-chart-arcs-background', "fill: #e0e0e0; stroke: none;");
    freeboard.addStyle('.c3-chart-arcs .c3-chart-arcs-gauge-unit', "fill: #000; font-size: 16px;");
    freeboard.addStyle('.c3-chart-arcs .c3-chart-arcs-gauge-max', "fill: #777;");
    freeboard.addStyle('.c3-chart-arcs .c3-chart-arcs-gauge-min', "fill: #777;");
    freeboard.addStyle('.c3-chart-arc .c3-gauge-value', "fill: #000;");

    // freeboard customised styles
    freeboard.addStyle('.c3 text', "fill: #d3d4d4");
    freeboard.addStyle('.c3 path.domain, .c3 .tick line', "stroke: #d3d4d4;");

    var freeboardC3Widget = function(settings) {
        var self = this;
        var currentSettings = settings;
        var currentOptions = null;
        var chart = null;
        var element = $('<div class="c3-chart-container"></div>');
        var padding = {
            right: 0
        };
        var flowBuffer = new Array();
        var maxFlowBufferLength = 20;

        self.calculatePadding = function(type) {
            padding.right = 0;
            if (type !== "gauge" &&
                type !== "pie" &&
                type !== "donut") {
                padding.right = 8;
            }
        }

        self.calculatePadding(currentSettings.type);

        self.createChart = function(createSettings) {
            // create our graph with empty data
            var options = {
                bindto: d3.selectAll(element.toArray()),
                data: {
                    type: createSettings.type,
                    json: []
                },
                padding: padding,
                size: {
                    height: createSettings.height * 60
                }
            };

            if((createSettings.options !== undefined) && (createSettings.options !== "")) {
                // handle bad options
                // without this, we will end up with empty C3 widgets at creation time
                try {
                    $.extend(options, createSettings.options);
                } catch(e) {
                    console.log(e);
                }
            }

            chart = c3.generate(options);
        }

        self.render = function(containerElement) {
            $(containerElement).empty();
            $(containerElement).append(element);
        }

        self.getHeight = function() {
            return currentSettings.height || 60;
        }

        self.onSettingsChanged = function(newSettings) {
            self.calculatePadding(newSettings.type);

            if(chart) {
                // check if the options cleared
                // empty "calculated" settings don't get sent to
                // the onCalculatedValueChanged method
                if (currentOptions && (newSettings.options === "")) {
                    self.createChart(newSettings);
                    currentOptions = null;
                } else if (newSettings.type !== currentSettings.type) {
                    chart.transform(newSettings.type);
                }
            }

            // check if flow changed
            // clear the flow buffer if it did
            if(currentSettings.flow != newSettings.flow) {
                flowBuffer = new Array();
            }

            currentSettings = newSettings;
        }

        self.onCalculatedValueChanged = function(settingName, newValue) {
            if(settingName === "options") {
                // check if the options have changed by doing a JSON serialise
                // and comparing the resulting output
                if((!currentOptions) || (JSON.stringify(currentOptions) !== JSON.stringify(newValue))) {
                    self.createChart({
                        type: currentSettings.type,
                        options: newValue,
                        height: currentSettings.height
                    });
                    currentOptions = newValue;
                }
            }

            if(chart) {
                if (settingName === "data") {
                    // c3 fails to pop old values while the page is not visible
                    // https://github.com/masayuki0812/c3/issues/1097
                    // check if the page is visible, if not, accumulate values
                    // but ensure we only store the last N values
                    // to avoid memory issues
                    if(currentSettings.flow) {
                        if(document.hidden) {
                            flowBuffer.push(newValue);
                            while(flowBuffer.length > maxFlowBufferLength) {
                                flowBuffer.shift();
                            }
                        } else {
                            while(flowBuffer.length > 0) {
                                chart.flow(flowBuffer.shift());
                            }
                            chart.flow(newValue);
                        }
                    } else {
                        newValue.unload = null;
                        chart.load(newValue);
                    }
                }
            }
        }

        self.onDispose = function() {
        }
    }
}());