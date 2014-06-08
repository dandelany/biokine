var _ = require('underscore');
var $ = require('jquery');
var d3 = require('d3');

// if you wish to make
// an apple pie from scratch,
// you must first invent the universe
//   -carl sagan

var Universe = function() {
    this.createSpace();
    this.createTime();
    this.createLife();
    return this;
};
Universe.prototype.createSpace = function() {
    this.$div = $('#universe');
    this.width = 600;
    this.height = 600;

    this.svg = d3.select('#universe').append('svg')
        .attr('width', this.width)
        .attr('height', this.height);
};

Universe.prototype.createTime = function() {
    this.tickTime = 10;
    this.tickInterval = setInterval(_.bind(this.tick, this), this.tickTime);
};
Universe.prototype.createLife = function() {
    this.organisms = _.times(100, function() {
        return new Organism();
    });

    this.organismEls = this.svg.selectAll('circle').data(this.organisms);
    this.organismEls.enter().append('circle')
        .attr('transform', function(d) { return "translate(" + d.x() + "," + d.y() + ")"; })
        .attr('r', function(d) { return d.radius(); })
        .attr('fill', function(d) { return d.color(); });
    this.organismEls.exit().remove();
};

Universe.prototype.tick = function() {
    _(this.organisms).each(function(organism) { organism.tick(); });
    this.render();
};
Universe.prototype.render = function() {
    this.organismEls //.attr('r', function(d) { return d.radius(); });
        .attr('transform', function(d) { return "translate(" + d.x() + "," + d.y() + ")"; });
    return this;
};


var Organism = function() {
    this._x = 300;
    this._y = 300;
    this._radius = Math.floor(Math.random() * 20);
    this._color = d3.interpolateLab('#000044', '#4733cc')(Math.round(Math.random() * 2) / 2);
    return this;
};
Organism.prototype.tick = function() {
    this._x += Math.round((Math.random() * 6) - 3);
    this._y += Math.round((Math.random() * 4) - 2);
};
Organism.prototype.radius = function() {
    return this._radius;
};
Organism.prototype.color = function() {
    return this._color;
};
Organism.prototype.x = function() {
    return this._x;
};
Organism.prototype.y = function() {
    return this._y;
}


var universe = new Universe().render();