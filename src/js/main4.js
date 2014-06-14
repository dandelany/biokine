_ = require('underscore');
$ = require('jquery');
d3 = require('d3');
Physics = require('./physicsjs-full.js');
Physics = require('./behaviors/charge-attraction.js')(Physics);
Physics = require('./behaviors/circle-size.js')(Physics);


var Universe = function(options) {
    this.options = _.extend({ // defaults
        width: 600, height: 600,
        el: 'universe',
        hasEdges: true
    }, options);
    this.world = options.world; // PhysicsJS world (required)
    this.center = Physics.vector(this.options.width, this.options.height).mult(0.5);
    this.viewportBounds = Physics.aabb(0, 0, this.options.width, this.options.height);

    // add the renderer
    this.renderer = this._initRenderer();
    this.world.add(this.renderer);
    this.world.on('step', _.bind(function () {
        this.world.render();
    }, this));

    // edge detection
    if(this.options.hasEdges) this.world.add(this._initEdges());
};
Universe.prototype._initRenderer = function() {
    return Physics.renderer('canvas', {
        el: 'universe'
        ,width: this.options.width
        ,height: this.options.height
    });
};
Universe.prototype._initEdges = function() {
    // constrain objects to these bounds
    return Physics.behavior('edge-collision-detection', {
        aabb: this.viewportBounds
        ,restitution: 0.99
        ,cof: 0.8
    });
};
Universe.prototype.randomX = function() { return Math.random() * this.options.width; };
Universe.prototype.randomY = function() { return Math.random() * this.options.height; };

Universe.prototype.addEatBehavior = function(predatorLabel, preyLabel) {
    this._eatBehaviors = this._eatBehaviors || {};
    if(this._eatBehaviors[predatorLabel] == preyLabel) { return; }

    // query to find a collision of eater with prey
    var eatQuery = Physics.query({
        $or: [
            { bodyA: { label: predatorLabel }, bodyB: { label: preyLabel } },
            { bodyB: { label: predatorLabel }, bodyA: { label: preyLabel } }
        ]
    });

    // look for collisions
    this.world.on('collisions:detected', _.bind(function(data, e){
        // find all collisions of eater with prey
        var eatCollisions = Physics.util.filter(data.collisions, eatQuery);
        if (eatCollisions.length){
            _.each(eatCollisions, _.bind(function(collision) {
                var eatenBody = collision.bodyA.label == preyLabel ? collision.bodyA : collision.bodyB;
                this.world.removeBody(eatenBody);
            }, this));
            //universe.world.off(e.topic, e.handler);
        }
    }, this));
};
Universe.prototype.addBehavior = function(name, options, applyTo) {
    options = options || {};
    var behavior = Physics.behavior(name, options);
    if(applyTo) { behavior.applyTo(applyTo); }
    this.world.add(behavior);
    return behavior;
};


var Herbivore = function(options) {
    this.options = _.extend({ // defaults
        color: '#992222',
        radius: 5,
        mass: 1
    }, options);
    this.universe = options.universe;

    this.body = Physics.body('circle', {
        label: 'herbivore',
        radius: this.options.radius,
        mass: 1,
        x: this.options.x || this.universe.randomX(),
        y: this.options.y || this.universe.randomY(),
        vx: 0,
        vy: 0,
        restitution: 0.01,
        charge: -3,
        styles: {
            fillStyle: this.options.color
        }
    });
};

var Vegetable = function(options) {
    this.options = _.extend({ // defaults
        color: '#99cc99',
        radius: 5,
        mass: 1
    }, options);
    this.universe = options.universe;

    this.body = Physics.body('circle', {
        label: 'vegetable',
        radius: this.options.radius,
        mass: 10000,
        x: this.options.x || this.universe.randomX(),
        y: this.options.y || this.universe.randomY(),
        vx: 0,
        vy: 0,
        restitution: 0.01,
        charge: 3,
        styles: {
            fillStyle: this.options.color
        }
    });
};


$(function() {
    Physics(function (world) {
        var universe = new Universe({
            world: world,
            el: 'universe',
            width: 600,
            height: 600
        });
        universe.addEatBehavior('herbivore', 'vegetable');


        var numHerbivores = 20,
            numVegetables = 100,
            v = Physics.vector(0, 300),
            herbivores = [],
            vegetables = [];

        while (numHerbivores--) { herbivores.push(new Herbivore({universe: universe})); }
        while (numVegetables--) { vegetables.push(new Vegetable({universe: universe})); }

        // add things to the world
        universe.world.add(_.map(herbivores.concat(vegetables), function(thing) { return thing.body; }));
        universe.addBehavior('circle-size',
            {amount: .004},
            _.map(vegetables, function(thing) { return thing.body; })
        );
        universe.world.add([
            Physics.behavior('charge-attraction', {
                strength: 0.005
                ,min: 5
                ,max: 500
            })
            ,Physics.behavior('sweep-prune')
            ,Physics.behavior('body-collision-detection', { checkAll: false })
            ,Physics.behavior('body-impulse-response')
        ]);

        // subscribe to ticker to advance the simulation
        Physics.util.ticker.on(function( time ) {
            universe.world.step( time );
        });

        // start the ticker
        Physics.util.ticker.start();
    });
});
