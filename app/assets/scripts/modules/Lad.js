
"use strict";

var Pos     = require('./Pos'),
    H       = require('./Hex'),
    Vec     = require('./Vec');

var Lad  = function(opts) {

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

/**
 * Used to give the lad move orders
 */
Lad.prototype.move = function() {

};

/**
 * Used to give the lad attack orderss
 */
Lad.prototype.attack = function(enemy) {

};

/**
 * 1. Do I need to shoot at anyone?
 * 2. Am I in danger?
 * 3. Are any other lads waiting for me to move?
 * 4. Do I have move orders?
 */
Lad.prototype.integrate = function() {
    var _ = this;

    /**
     * Following move orders
     */
    if ( _.path.length ) {

        /**
         * Arrived at the next waypoint
         */
        if ( _.pos.vec.isCloseTo( _.next.vec, 2 ) ) {
            _.current = _.next;
            _.pos = _.target;
            _.next = _.path.pop();
            _.target = hex_to_pixel(_.layout, _.next);

        /**
         * Travelling
         */
        } else {
            _.dir = _.next.vec.minusNew(_.pos.vec).normalise().multiplyEq(4);
            _.pos.plusEq(_.dir);
        }

    /**
     * Awaiting move orders
     */
    } else if ( _.target !== undefined ) {
        _.pos = _.target;
        _.target = undefined;
        _.travelling = false;
    }
};

Lad.prototype.dmg = function(amount) {

};

module.exports = Lad;
