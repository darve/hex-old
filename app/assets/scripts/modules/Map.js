
"use strict";

var H       = require('./Hex'),
    Vec     = require('./Vec');

/**
 * This module is in charge of everything relating to the map.
 *
 * 1. Can this lad move here?
 * 2. This lad needs to come out of base X, where is that?
 * 3. Is there a clear route from A to B?
 */
module.exports = (function(opts) {

    /**
     * Naming convention:
     * _ preceding the name means it is an ES6 set,
     * this is to make it easy to check for unique positions on the map.
     *
     * hexes: grid
     *
     * blocked: places that lads can't travel to / on
     *
     * bases: buildings that lads cant travel on
     */
    var
        gfx,

        layout = opts.layout,

        grid = [],
        _grid = new Set(),

        blocked = [],
        _blocked = new Set(),

        bases = [],
        _bases = new Set(),

        cache = [],
        _cache = new Set(),

        size = 20,

        frontier,
        visited,
        came_from,
        k = 0;


    /**
     * 1. Generate a layout
     * 2. Set a hex size
     * 3. Generate a map / grid from the above two pieces of information
     *
     * parameters:
     *
     * gfx: instance of the Graphics module
     * map: map options
     * size: hex size
     */
    function init(opts) {

        gfx = opts.gfx;
        layout = H.Layout(H.layout_pointy, new Vec(opts.size, opts.size), new Vec(0, 0));
        grid = generateGrid(opts.w, opts.h);

        // Add all of the grid hexes to the grid set
        grid.forEach(function(i){
            _grid.add(H.hex_to_string(i));
        });

    }

    // This grid is only for drawing enough hexes to fill the screen.
    // Eventually this will be used to generate a map of a specific size for different maps.
    function generateGrid(w, h) {
        var hexes = [];
        var i1 = -Math.floor(w/2), i2 = i1 + w;
        var j1 = -Math.floor(h/2), j2 = j1 + h;
        for (var j = j1; j < j2; j++) {
            var jOffset = -Math.floor(j/2);
            for (var i = i1 + jOffset; i < i2 + jOffset; i++) {
                hexes.push(new Hex(i, j, -i-j));
            }
        }
        return hexes;
    }

    function atob(start, end) {

        var s,
            path,
            node,
            temp;

        s = new search(hex_round(pixel_to_hex(layout, start)), 64);

        // Reconstruct path to mouseover position
        path = [];
        node = end;
        path.push(end);

        while (node != null) {
            path.push(hex_round(node));
            node = s.came_from[hex_to_string(node)];
        }

        lad.path = path;
        lad.target = hex_to_pixel(layout, lad.path.pop());
        lad.next = lad.path[lad.path.length-1];
        lad.travelling = true;
    }

    function search(start, movement, goal) {


        /**
         * These things should probably be stored in the CACHE
         */

        // Used for storing unique hexes so we know which ones we have visited.
        visited = new Set();
        visited.add(hex_to_string(start));

        _blocked = new Set();
        blocked.forEach(function(i) {
            _blocked.add(hex_to_string(i));
        });

        // An array of the hexes in the outskirts of our search.
        frontier = [[start]];

        // A proper list of where we have come from
        came_from = {};
        came_from[hex_to_string(start)] = null;

        // Iterate through frontier and visit all of the neighbours within.
        // If the neighbours have not been seen, add them to the motherfucking frontier
        for ( var k = 0; k < movement && frontier[k].length > 0; k++ ) {
            // Create a new array for the next level of frontier bants.
            frontier[k+1] = [];

            // Iterate through the current list of frontier hexes
            for ( var f in frontier[k] ) {

                // For each of the possible directions for this hex, lets see if we have
                // visited the neighbor of this hex in that direction
                for ( var dir = 0; dir < 6; dir++ ) {

                    // Get the neighbor
                    var neighbor = hex_neighbor(frontier[k][f], dir);

                    // Check if it has been visited
                    if (visited.has(hex_to_string(neighbor))) {
                        // console.log('visited ', neighbor);
                    } else if ( _blocked.has(hex_to_string(neighbor)) ) {
                        // console.log('blocked', neighbor);
                    } else {

                        // If it hasn't, add it to the motherfuckin' frontier
                        frontier[k+1].push(neighbor);

                        // Add it to the visited array
                        visited.add(hex_to_string(neighbor));
                        came_from[hex_to_string(neighbor)] = frontier[k][f];
                    }
                }
            }
        }

        return { came_from: came_from };
    }

    // Given a set of screen coordinates, the return the hex that is occupied at that point
    function pos(x, y) {
        return H.hex_round(H.pixel_to_hex(layout, { x: x, y: y }));
    }

    return {
        init: init,
        generateGrid: generateGrid,
        atob: atob,
        search: search
    };

})();
