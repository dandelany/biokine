_ = require('underscore');
$ = require('jquery');
d3 = require('d3');
Physics = require('./physicsjs-full.js');
Physics = require('./behaviors/charge-attraction.js')(Physics);

$(function() {
    Physics(function (world) {
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
        attractor = Physics.behavior('attractor', {
            pos: Physics.vector(viewWidth, viewHeight).mult(0.5)
            ,strength: .0005
            ,order: 1
        });

        // add the renderer
        world.add(renderer);
        // render on each step
        world.on('step', function () {
            world.render();
        });

        // constrain objects to these bounds
        edgeBounce = Physics.behavior('edge-collision-detection', {
            aabb: viewportBounds
            ,restitution: 0.99
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
            '#222222',
            '#667799'
        ];
        // create some bodies
        var l = 150;
        var bodies = [];
        var v = Physics.vector(0, 300);
        var b, r;

        while ( l-- ) {
            r = (2 + Math.random()*5)|0;
            b = Physics.body('circle', {
                radius: 10
                ,mass: 1
                ,x: center.x + (Math.random() * 600) - 300
                ,y: center.y + (Math.random() * 600) - 300
//                ,vx: Math.random() - 0.5
//                ,vy: Math.random() - 0.5
                ,vx: 0
                ,vy: 0
                ,restitution: 0.01
                //,cof: 0.9
                ,charge: (l%2 == 0) ? -10 : 10
                //,charge: -1
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
            Physics.behavior('charge-attraction', {
                strength: 0.005
                ,min: 5
                ,max: 40
            })


            ,Physics.behavior('sweep-prune')
            ,Physics.behavior('body-collision-detection', { checkAll: false })
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
