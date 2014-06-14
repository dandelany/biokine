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
    Physics.behavior('circle-size', function(parent){

        var defaults = {
            amount: .05
        };

        return {

            // extended
            init: function( options ){
                // call parent init method
                parent.init.call( this );
                this.options.defaults( defaults );
//              this.options.onChange(function( opts ){ });
                this.options( options );
            },

            // extended
            behave: function( data ){
                var bodies = this.getTargets(),
                    body,
                    amount = this.options.amount;

                for ( var j = 0, l = bodies.length; j < l; j++ ){
                    body = bodies[j];
                    body.geometry.radius += amount;
                    body.recalc();
                    body.view = undefined;
                }
            }
        };
    });

    // end module: behaviors/circle-size.js
    return Physics;
}));// UMD