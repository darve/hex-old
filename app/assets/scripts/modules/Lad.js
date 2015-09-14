var Pos = require('./pos');

module.exports = (function() {

    var Lad = function(opts) {

        var _ = this;

        _.pos = new Pos(opts.layout, opts.pos);
        _.path = opts.path;
        _.next = _.getnext();
        _.dir = new Vec(0, 1);

        _.health = 100;

    };

    Lad.prototype.getpos = function() {
        return this.pos;
    };

    Lad.prototype.getpath = function() {
        return this.path;
    };

    Lad.prototype.getnext = function() {
        return this.next;
    }

    Lad.prototype.getdir = function() {
        return this.dir;
    };

    Lad.prototype.move = function(h, v) {

    };

    Lad.prototype.dmg = function(amount) {

    };

	return Lad;
})();
