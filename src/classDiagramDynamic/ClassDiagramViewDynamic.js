import React, {Component} from 'react';
import * as d3 from 'd3';
import {ClassDiagramRender, ClassDiagramGraph} from "d3-uml/src/uml/uml";
import {Relation} from "d3-uml/src/uml/class-diagram-relationship"

class ClassDiagramViewDynamic extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: []
        };
    }

    componentDidMount() {
        var data = {
                "classes":
                    [{
                        "className": "ViewController()",
                        "attributes": [],
                        "methods": [],
                        "identify": "$CLASS(ViewController())$FILE(ViewController.m)$PATH(.%2Fsrc%2Ftest%2Fjava%2Fresources%2Fuml%2Fproject%2Fios_hello%2FHelloWorldApp)$PATH(.%2Fsrc%2Ftest%2Fjava%2Fresources%2Fuml%2Fproject%2Fios_hello)"
                    }, {
                        "className": "Child",
                        "attributes": [],
                        "methods": [],
                        "identify": "$CLASS(Child)$FILE(AppDelegate.m)$PATH(.%2Fsrc%2Ftest%2Fjava%2Fresources%2Fuml%2Fproject%2Fios_hello%2FHelloWorldApp)$PATH(.%2Fsrc%2Ftest%2Fjava%2Fresources%2Fuml%2Fproject%2Fios_hello)"
                    }, {
                        "className": "Parent",
                        "attributes": [],
                        "methods": [],
                        "identify": "$CLASS(Parent)$FILE(AppDelegate.h)$PATH(.%2Fsrc%2Ftest%2Fjava%2Fresources%2Fuml%2Fproject%2Fios_hello%2FHelloWorldApp)$PATH(.%2Fsrc%2Ftest%2Fjava%2Fresources%2Fuml%2Fproject%2Fios_hello)"
                    }, {
                        "className": "ViewController",
                        "attributes": [],
                        "methods": ["viewDidLoad", "didReceiveMemoryWarning"],
                        "identify": "$CLASS(ViewController)$FILE(ViewController.m)$PATH(.%2Fsrc%2Ftest%2Fjava%2Fresources%2Fuml%2Fproject%2Fios_hello%2FHelloWorldApp)$PATH(.%2Fsrc%2Ftest%2Fjava%2Fresources%2Fuml%2Fproject%2Fios_hello)"
                    }, {
                        "className": "HelloWorldAppTests",
                        "attributes": [],
                        "methods": ["setUp", "tearDown", "testExample", "testPerformanceExample"],
                        "identify": "$CLASS(HelloWorldAppTests)$FILE(HelloWorldAppTests.m)$PATH(.%2Fsrc%2Ftest%2Fjava%2Fresources%2Fuml%2Fproject%2Fios_hello%2FHelloWorldAppTests)$PATH(.%2Fsrc%2Ftest%2Fjava%2Fresources%2Fuml%2Fproject%2Fios_hello)"
                    }, {
                        "className": "Hello",
                        "attributes": [],
                        "methods": ["return_hello", "null_dereference_bug", "ivar_not_nullable_bug:(Hello*)hello", "parameter_not_null_checked_bug:(Hello*)hello"],
                        "identify": "$CLASS(Hello)$FILE(Hello.m)$PATH(.%2Fsrc%2Ftest%2Fjava%2Fresources%2Fuml%2Fproject%2Fios_hello%2FHelloWorldApp)$PATH(.%2Fsrc%2Ftest%2Fjava%2Fresources%2Fuml%2Fproject%2Fios_hello)"
                    }, {
                        "className": "AppDelegate",
                        "attributes": [],
                        "methods": ["memory_leak_bug", "resource_leak_bug", "npe_in_array_literal_bug", "premature_nil_termination_argument_bug", "retain_cycle_bug"],
                        "identify": "$CLASS(AppDelegate)$FILE(AppDelegate.m)$PATH(.%2Fsrc%2Ftest%2Fjava%2Fresources%2Fuml%2Fproject%2Fios_hello%2FHelloWorldApp)$PATH(.%2Fsrc%2Ftest%2Fjava%2Fresources%2Fuml%2Fproject%2Fios_hello)"
                    }, {
                        "className": "Parent",
                        "attributes": [],
                        "methods": [],
                        "identify": "$CLASS(Parent)$FILE(AppDelegate.m)$PATH(.%2Fsrc%2Ftest%2Fjava%2Fresources%2Fuml%2Fproject%2Fios_hello%2FHelloWorldApp)$PATH(.%2Fsrc%2Ftest%2Fjava%2Fresources%2Fuml%2Fproject%2Fios_hello)"
                    }, {
                        "className": "AppDelegate()",
                        "attributes": ["(^retain_cycle_block)()", "string"],
                        "methods": [],
                        "identify": "$CLASS(AppDelegate())$FILE(AppDelegate.m)$PATH(.%2Fsrc%2Ftest%2Fjava%2Fresources%2Fuml%2Fproject%2Fios_hello%2FHelloWorldApp)$PATH(.%2Fsrc%2Ftest%2Fjava%2Fresources%2Fuml%2Fproject%2Fios_hello)"
                    }, {
                        "className": "Child",
                        "attributes": [],
                        "methods": [],
                        "identify": "$CLASS(Child)$FILE(AppDelegate.h)$PATH(.%2Fsrc%2Ftest%2Fjava%2Fresources%2Fuml%2Fproject%2Fios_hello%2FHelloWorldApp)$PATH(.%2Fsrc%2Ftest%2Fjava%2Fresources%2Fuml%2Fproject%2Fios_hello)"
                    }, {
                        "className": "Hello",
                        "attributes": ["s", "hello"],
                        "methods": ["load", "return_hello", "null_dereference_bug", "ivar_not_nullable_bug:(Hello*)hello", "parameter_not_null_checked_bug:(Hello*)hello"],
                        "identify": "$CLASS(Hello)$FILE(Hello.h)$PATH(.%2Fsrc%2Ftest%2Fjava%2Fresources%2Fuml%2Fproject%2Fios_hello%2FHelloWorldApp)$PATH(.%2Fsrc%2Ftest%2Fjava%2Fresources%2Fuml%2Fproject%2Fios_hello)"
                    }, {
                        "className": "AppDelegate",
                        "attributes": ["window"],
                        "methods": [],
                        "identify": "$CLASS(AppDelegate)$FILE(AppDelegate.h)$PATH(.%2Fsrc%2Ftest%2Fjava%2Fresources%2Fuml%2Fproject%2Fios_hello%2FHelloWorldApp)$PATH(.%2Fsrc%2Ftest%2Fjava%2Fresources%2Fuml%2Fproject%2Fios_hello)"
                    }, {
                        "className": "ViewController",
                        "attributes": [],
                        "methods": [],
                        "identify": "$CLASS(ViewController)$FILE(ViewController.h)$PATH(.%2Fsrc%2Ftest%2Fjava%2Fresources%2Fuml%2Fproject%2Fios_hello%2FHelloWorldApp)$PATH(.%2Fsrc%2Ftest%2Fjava%2Fresources%2Fuml%2Fproject%2Fios_hello)"
                    }, {
                        "className": "Hello()",
                        "attributes": [],
                        "methods": [],
                        "identify": "$CLASS(Hello())$FILE(Hello.m)$PATH(.%2Fsrc%2Ftest%2Fjava%2Fresources%2Fuml%2Fproject%2Fios_hello%2FHelloWorldApp)$PATH(.%2Fsrc%2Ftest%2Fjava%2Fresources%2Fuml%2Fproject%2Fios_hello)"
                    }, {
                        "className": "NSObject",
                        "attributes": [],
                        "methods": [],
                        "identify": "NSObject"
                    }, {
                        "className": "NSObject",
                        "attributes": [],
                        "methods": [],
                        "identify": "NSObject"
                    }, {
                        "className": "NSObject",
                        "attributes": [],
                        "methods": [],
                        "identify": "NSObject"
                    }, {
                        "className": "UIResponder",
                        "attributes": [],
                        "methods": [],
                        "identify": "UIResponder"
                    }, {
                        "className": "UIViewController",
                        "attributes": [],
                        "methods": [],
                        "identify": "UIViewController"
                    }], "relations":
                    [{
                        "fromIdentify": "$CLASS(Parent)$FILE(AppDelegate.h)$PATH(.%2Fsrc%2Ftest%2Fjava%2Fresources%2Fuml%2Fproject%2Fios_hello%2FHelloWorldApp)$PATH(.%2Fsrc%2Ftest%2Fjava%2Fresources%2Fuml%2Fproject%2Fios_hello)",
                        "fromClassName": "Parent",
                        "toIdentify": "NSObject",
                        "toClassName": "NSObject",
                        "relation": "Realization"
                    }, {
                        "fromIdentify": "$CLASS(Child)$FILE(AppDelegate.h)$PATH(.%2Fsrc%2Ftest%2Fjava%2Fresources%2Fuml%2Fproject%2Fios_hello%2FHelloWorldApp)$PATH(.%2Fsrc%2Ftest%2Fjava%2Fresources%2Fuml%2Fproject%2Fios_hello)",
                        "fromClassName": "Child",
                        "toIdentify": "NSObject",
                        "toClassName": "NSObject",
                        "relation": "Realization"
                    }, {
                        "fromIdentify": "$CLASS(Hello)$FILE(Hello.h)$PATH(.%2Fsrc%2Ftest%2Fjava%2Fresources%2Fuml%2Fproject%2Fios_hello%2FHelloWorldApp)$PATH(.%2Fsrc%2Ftest%2Fjava%2Fresources%2Fuml%2Fproject%2Fios_hello)",
                        "fromClassName": "Hello",
                        "toIdentify": "NSObject",
                        "toClassName": "NSObject",
                        "relation": "Realization"
                    }, {
                        "fromIdentify": "$CLASS(AppDelegate)$FILE(AppDelegate.h)$PATH(.%2Fsrc%2Ftest%2Fjava%2Fresources%2Fuml%2Fproject%2Fios_hello%2FHelloWorldApp)$PATH(.%2Fsrc%2Ftest%2Fjava%2Fresources%2Fuml%2Fproject%2Fios_hello)",
                        "fromClassName": "AppDelegate",
                        "toIdentify": "UIResponder",
                        "toClassName": "UIResponder",
                        "relation": "Realization"
                    }, {
                        "fromIdentify": "$CLASS(ViewController)$FILE(ViewController.h)$PATH(.%2Fsrc%2Ftest%2Fjava%2Fresources%2Fuml%2Fproject%2Fios_hello%2FHelloWorldApp)$PATH(.%2Fsrc%2Ftest%2Fjava%2Fresources%2Fuml%2Fproject%2Fios_hello)",
                        "fromClassName": "ViewController",
                        "toIdentify": "UIViewController",
                        "toClassName": "UIViewController",
                        "relation": "Realization"
                    }]
            }
        ;

        var g = new ClassDiagramGraph().setGraph({});

        var classes = data["classes"];
        var relations = data["relations"];

        classes.forEach((v, i) => {
            v.classname = v.className;
            v.x = 0;
            v.y = 0;
            v.width = 260;
            g.setClassDiagramNode(v);
        });

        relations.forEach((v, i) => {
            g.setEdge(v.fromIdentify, v.toIdentify, Relation(v.relation))
        });

        var svg = d3.select(this.chartRef)
            .attr("width", 1500)
            .attr("height", 1200);

        var inner = svg.append("g")

        // Set up zoom support
        var zoom = d3.zoom().on("zoom", function () {
            inner.attr("transform", d3.event.transform);
        });
        svg.call(zoom);

        // Create the renderer
        var render = new ClassDiagramRender();

        render(inner, g);

        // Center the graph
        var initialScale = 0.75;
        svg.call(zoom.transform, d3.zoomIdentity.translate((svg.attr("width") - g.graph().width * initialScale) / 2, 20).scale(initialScale));

        // svg.attr('height', g.graph().height * initialScale + 40);
    }

    render() {


        return (

            <div>
                <form action="http://127.0.0.1" method="post">
                    <input name="repo"/>
                    <input type="submit"/>
                </form>
                <svg className="svg" ref={(r) => this.chartRef = r}/>
            </div>
        );
    }
}

export default ClassDiagramViewDynamic;