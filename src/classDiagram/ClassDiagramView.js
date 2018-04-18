import React, {Component} from 'react';
import * as d3 from 'd3';
import {ClassDiagramRender, ClassDiagramGraph} from "d3-uml/src/uml/uml";
import {Aggregation, Association, Composition, Dependency, Generalization, Realization} from "d3-uml/src/uml/class-diagram-relationship"

class ClassDiagramView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [
            ]
        };
    }

    componentDidMount() {
        var o2 = {
            x: 0, y: 0, width: 260,
            classname: "氧气",
        };
        var animals = {
            x: 0, y: 0, width: 260,
            classname: "动物",
            attributes: ["生命"],
            methods: ["新城代谢", "繁殖"]
        };

        var water = {
            x: 0, y: 0, width: 260,
            classname: "水",
        };

        var bird = {
            x: 0, y: 0, width: 260,
            classname: "鸟",
            attributes: ["羽毛"],
            methods: ["下蛋"]
        };

        var chibasa = {
            x: 0, y: 0, width: 260,
            classname: "翅膀",
        };

        var fly = {
            x: 0, y: 0, width: 260,
            classname: "飞翔",
        };

        var dayan = {
            x: 0, y: 0, width: 260,
            classname: "大雁",
            methods: ["下蛋", "飞"]
        };

        var duck = {
            x: 0, y: 0, width: 260,
            classname: "鸭子",
            methods: ["下蛋"]
        };


        var qie = {
            x: 0, y: 0, width: 260,
            classname: "企鹅",
            methods: ["下蛋"]
        };


        var yanqun = {
            x: 0, y: 0, width: 260,
            classname: "雁群",
        };


        var tanglaoya = {
            x: 0, y: 0, width: 260,
            classname: "唐老鸭",
            methods: ["说话"]
        };


        var shuohua = {
            x: 0, y: 0, width: 260,
            classname: "讲话",
            methods: ["说话"]
        };


        var qihou = {
            x: 0, y: 0, width: 260,
            classname: "气候",
        };

        var g = new ClassDiagramGraph().setGraph({});

        g.setClassDiagramNode(o2);
        g.setClassDiagramNode(animals);
        g.setClassDiagramNode(water);
        g.setClassDiagramNode(bird);
        g.setClassDiagramNode(chibasa);
        g.setClassDiagramNode(fly);
        g.setClassDiagramNode(dayan);
        g.setClassDiagramNode(duck);
        g.setClassDiagramNode(qie);
        g.setClassDiagramNode(yanqun);
        g.setClassDiagramNode(tanglaoya);
        g.setClassDiagramNode(shuohua);
        g.setClassDiagramNode(qihou);

        g.setEdge(animals.classname, o2.classname, Dependency());
        g.setEdge(animals.classname, water.classname, Generalization());
        g.setEdge(bird.classname, animals.classname, Realization());
        g.setEdge(bird.classname, chibasa.classname, Composition());
        g.setEdge(dayan.classname, bird.classname, Generalization());
        g.setEdge(duck.classname, bird.classname, Generalization());
        g.setEdge(qie.classname, bird.classname, Generalization());
        g.setEdge(dayan.classname, fly.classname, Realization());
        g.setEdge(yanqun.classname, dayan.classname, Aggregation());
        g.setEdge(tanglaoya.classname, duck.classname, Realization());
        g.setEdge(tanglaoya.classname, shuohua.classname, Realization());
        g.setEdge(qie.classname, qihou.classname, Association());

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

export default ClassDiagramView;