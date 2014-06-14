var _ = require('underscore');
window.$ = require('jquery');
window.d3 = require('d3');
Physics = require('./physicsjs-full.js'); // doesn't work? including via script tag


//
// PhysicsJS
// A modular, extendable, and easy-to-use physics engine for javascript
//
// Use the select box in the top right to see more examples!
//

$(function() {
    Physics(function (world) {
        window.document = document;
        var viewWidth = 600
            ,viewHeight = 600
        // center of the window
            ,center = Physics.vector(viewWidth, viewHeight).mult(0.5)
        // bounds of the window
            ,viewportBounds = Physics.aabb(0, 0, viewWidth, viewHeight)
            ,attractor
            ,edgeBounce
            ,renderer
            ;

        // create a renderer
        renderer = Physics.renderer('canvas', {
            el: 'universe'
            ,width: viewWidth
            ,height: viewHeight
        });

        // add the renderer
        world.add(renderer);
        // render on each step
        world.on('step', function () {
            world.render();
        });

        // attract bodies to a point
        attractor = Physics.behavior('attractor', {
            pos: Physics.vector(viewWidth, viewHeight).mult(0.33)
            ,strength: .05
            ,order: 1
        });

        // constrain objects to these bounds
        edgeBounce = Physics.behavior('edge-collision-detection', {
            aabb: viewportBounds
            ,restitution: 0.2
            ,cof: 0.8
        });

//        // move the attractor position to match the mouse coords
//        renderer.el.addEventListener('mousemove', function( e ){
//            attractor.position({ x: e.pageX, y: e.pageY });
//        });

//        colors = [
//            '#eeffff',
//            '#ffeeff',
//            '#ffffee',
//            '#ffeeee',
//            '#eeffee',
//            '#eeeeff',
//            '#ffffff'
//        ];
        colors = [
            '#3333ee',
            '#ee3333',
            '#3344cf',
            '#99002a',
            '#09097a',
            '#cb4523',
        ]
        // create some bodies
        var l = 100;
        var bodies = [];
        var v = Physics.vector(0, 300);
        var b, r;

        while ( l-- ) {
            r = (2 + Math.random()*5)|0;
            b = Physics.body('circle', {
                radius: r
                ,mass: r * 0.7
                ,x: center.x + (Math.random() * 20) - 10
                ,y: center.y + (Math.random() * 20) - 10
                ,vx: Math.random() - 0.5
                ,vy: Math.random() - 0.5
                ,restitution: 0.99
                ,styles: {
                    fillStyle: colors[ l % colors.length ]
                }
            });
            bodies.push(b);
            v.perp(true)
                .mult(10000)
                .rotate(l / 3);
        }

        // add things to the world
        world.add( bodies );
        world.add([
            Physics.behavior('newtonian', {
                strength: 0.005
                ,min: 10
            }).applyTo(_(bodies).filter(function(b, i) { return i % 2 == 0; }))
            ,Physics.behavior('newtonian', {
                strength: 0.005
                ,min: 10
            }).applyTo(_(bodies).filter(function(b, i) { return i % 2 == 1; }))


//            ,Physics.behavior('sweep-prune')
//            ,Physics.behavior('body-collision-detection', { checkAll: false })
            ,Physics.behavior('body-impulse-response')
            ,edgeBounce
            //,attractor
        ]);

        // subscribe to ticker to advance the simulation
        Physics.util.ticker.on(function( time ) {
            world.step( time );
        });

        // start the ticker
        Physics.util.ticker.start();
    });
});
