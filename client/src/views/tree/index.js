require('./style.less')
require('./tree.less')
import config from '../../config'
import {draw} from './tree.js'

export default {
    template: require('./template.html'),
    data: function() {
        return {
            lcid: null,
            enterprise: null,
            tree: null
        }
    },
    ready: function() {
        this.$watch('tree', function(value, mutation) {
            draw(value)
        })
    },
    compiled: function() {
        this.$root.isDashboard = false
    },
    methods: {
        update: function() {
            let self = this
            self.$http.get(`${config.api_url}/enterprises/${self.lcid}`, function(data, status, request) {
                self.enterprise = data.data["enterprise"]
            },{
                headers: {
                    'Authorization': localStorage.getItem('token')
                }
            }).error(function(data){
                self.$root.message.show('error', data["message"]);
            })

            self.$http.get(`${config.api_url}/tree/${self.lcid}`, function(data, status, request) {
                self.tree = data.data
            }, {
                headers: {
                    'Authorization': localStorage.getItem('token')
                }
            }).error(function(data) {
                self.$root.message.show('error', data["message"]);
            })
        }
    },
    route: {
        data ({to: {params: {lcid}}}) {
            console.log(lcid);
            this.lcid = lcid
            this.update()
        }
    }
}

// var m = [20, 120, 20, 120]
//   , w = 1800 - m[1] - m[3]
//   , h = 600 - m[0] -m[2]
//   , i = 0
//   , root = null
//
// var tree = d3.layout.tree().size([h, w])
// var diagonal = d3.svg.diagonal()
//     .projection((d)=> [d.y, d.x])
//
// var vis = null
//
// var draw = function(value) {
//     vis = d3.select('#enterprisetree').append("svg:svg")
//         .attr("width", w + m[1] + m[3])
//         .attr("height", h + m[0] + m[2])
//         .append("svg:g")
//         .attr("transform", `translate(${m[3]}, ${m[0]})`)
//
//     root = value
//     root.x0 = h / 2
//     root.y0 = 0
//     update(root)
// }
//
// var update = function(source) {
//     var duration = d3.event && d3.event.altKey ? 5000 : 500
//     console.log(duration);
//     var nodes = tree.nodes(root).reverse()
//     nodes.forEach((d)=> d.y = d.depth * 180)
//     var node = vis.selectAll("g.node")
//         .data(nodes, (d)=> d.id || (d.id = ++i))
//
//     var nodeEnter = node.enter().append("svg:g")
//         .attr("class", "node")
//         .attr("transform", (d)=> `translate(${source.y0}, ${source.x0})`)
//         .on("click", function(d){
//             toggle(d)
//             update(d)
//         })
//
//     nodeEnter.append("svg:circle")
//         .attr("r", 1e-6)
//         .style('fill', function(d){
//             d._children ? "lightsteelblue" : "#fff"
//         })
//
//     nodeEnter.append("svg:text")
//         .attr("x", (d)=> d.children || d._children ? -10 : 10)
//         .attr("dy", "-.35em")
//         .attr("text-anchor", (d)=> d.children || d._children ? "end" : "start")
//         .text((d)=> d.entname)
//         .style("fill-opacity", 1e-6)
//
//     nodeEnter.append("svg:text")
//         .attr("x", (d)=> d.children || d._children ? -10 : 10)
//         .attr("dy", "1em")
//         .attr("text-anchor", (d)=> d.children || d._children ? "end" : "start")
//         .text((d)=> d.esdate)
//
//     var nodeUpdate = node.transition()
//         .duration(duration)
//         .attr("transform", (d)=> `translate(${d.y}, ${d.x})`)
//
//     nodeUpdate.select("circle")
//         .attr("r", 4.5)
//         .style("fill", (d)=> d._children ? "lightsteelblue" : "#fff")
//
//     nodeUpdate.select("text")
//         .style("fill-opacity", 1)
//
//     var nodeExit = node.exit().transition()
//         .duration(duration)
//         .attr("transform", (d)=> `translate(${source.y}, ${source.x})`)
//         .remove()
//
//     nodeExit.select("circle")
//         .attr("r", 1e-6)
//
//     nodeExit.select("text")
//         .style("fill-opacity", 1e-6)
//
//     var link = vis.selectAll("path.link")
//         .data(tree.links(nodes), (d)=> d.target.id)
//     link.enter().insert("svg:path", "g")
//         .attr("class", "link")
//         .attr("d", function(d) {
//             var o = {x: source.x0, y: source.y0}
//             diagonal({source: o, target: o})
//         })
//         .transition()
//         .duration(duration)
//         .attr("d", diagonal)
//
//     link.transition()
//         .duration(duration)
//         .attr("d", diagonal)
//
//     link.exit().transition()
//         .duration(duration)
//         .attr("d", function(d){
//             var o = {x: source.x, y: source.y}
//             diagonal({source: o, target: o})
//         })
//         .remove()
//
//     nodes.forEach(function(d){
//         d.x0 = d.x
//         d.y0 = d.y
//     })
// }
//
// var toggle = function(d) {
//
//     if(d.children) {
//         d._children = d.children
//         d.children = null
//     } else {
//         d.children = d._children
//         d._children = null
//     }
// }
