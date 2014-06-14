(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['physicsjs'], factory);
    } else if (typeof exports === 'object') {
        module.exports = factory;
    } else {
        factory.call(root, root.Physics);
    }
}(window, function (Physics) {
    'use strict';
    /**
     * class CircleSizeBehavor < Behavior
     *
     * `Physics.behavior('circle-size')`.
     *
     * Radius-changing behavior for circular bodies.
     * Circle radii grow by a certain amount every tick
     *
     * Additional options include:
     * - amount: Change in circle radius (default: `.05`)
     **/
    Physics.behavior('charge-attraction', function( parent ){

        var defaults = {
            strength: .05
        };

        return {

            // extended
            init: function( options ){

                var self = this;
                // call parent init method
                parent.init.call( this );
                this.options.defaults( defaults );
//                this.options.onChange(function( opts ){
//                    self._maxDistSq = opts.max === false ? Infinity : opts.max * opts.max;
//                    self._minDistSq = opts.min ? opts.min * opts.min : 100 * opts.strength;
//                });
                this.options( options );
            },

            // extended
            behave: function( data ){

                var bodies = this.getTargets()
                    ,body
                    ,other
                    ,strength = this.options.strength
                    ,minDistSq = this._minDistSq
                    ,maxDistSq = this._maxDistSq
                    ,scratch = Physics.scratchpad()
                    ,pos = scratch.vector()
                    ,normsq
                    ,g
                    ;

                for ( var j = 0, l = bodies.length; j < l; j++ ){

                    body = bodies[ j ];
                    body.geometry.radius += 1;
                    body.recalc();
                    body.view = undefined;

//                    for ( var i = j + 1; i < l; i++ ){
//
//                        other = bodies[ i ];
//                        // clone the position
//                        pos.clone( other.state.pos );
//                        pos.vsub( body.state.pos );
//                        // get the square distance
//                        normsq = pos.normSq();
//
//                        if (normsq > minDistSq && normsq < maxDistSq){
//                            g = strength / normsq;
//                            body.charge = body.charge || 0;
//                            other.charge = other.charge || 0;
//                            body.accelerate( pos.normalize().mult(g * other.charge * body.charge).negate() );
//                            other.accelerate( pos.mult( body.mass/other.mass ).negate() );
//                        }
//                    }
                }

                scratch.done();
            }
        };
    });

    // end module: behaviors/charge-attraction.js
    return Physics;
}));// UMD