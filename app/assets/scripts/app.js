
/**
 * Smash targets below this line
 * -----------------------------
 */



var
    // Fucking jQuery am I rite lads
    $       = require('jquery'),

    // These are the bespoke modules that build up this application
    Lad     = require('./modules/Lad'),
    H       = require('./modules/Hex'),
    Vec     = require('./modules/Vec'),
    Map     = require('./modules/Map'),
    gfx     = require('./modules/Graphics'),
    Utils   = require('./modules/Utils');

(function(win, doc, c) {

    "use strict";

    var cx = c.getContext('2d'),
        w = win.innerWidth,
        h = win.innerHeight,

        _ = {
            bg: "#F5F7FA",
            fg: "#FFCE54",
            txt: "#656D78",
            blocked: "#434A54",
            hexes: undefined,
            layout: undefined,
            size: 20,
            current: undefined
        },

        // Array of Lads
        Lads = [],

        blocked = [
            Hex(-1,-1,2),
            Hex(-2,0,2),
            Hex(-2,1,1),
            Hex(-2,2,0),
            Hex(-1,2,-1),
            Hex(0,2,-2),
            Hex(1,1,-2),
            Hex(2,0,-2),
            Hex(2,-1,-1),
            Hex(-1,-3,4),
            Hex(0,-3,3),
            Hex(1,-3,2),
            Hex(2,-3,1),
            Hex(3,-3,0),
            Hex(4,-3,-1),
            Hex(-2,-3,5),
            Hex(5,-3,-2),
            Hex(1,-5,4),
            Hex(4,-5,1),
            Hex(1,-6,5),
            Hex(5,-6,1),
            Hex(5,-7,2),
            Hex(2,-7,5),
            Hex(3,-8,5),
            Hex(4,-8,4),
            Hex(5,-8,3)
        ],

        _blocked = new Set(),

        frontier,
        visited,
        came_from,
        k = 0;

    function render() {
        requestAnimationFrame(render);
        gfx.render(function() {
            integrate();
            draw();

            gfx.map();
            gfx.pre();
            gfx.lads();
            gfx.post();
            gfx.fx();
            gfx.ui();
        });
    }

    function integrate() {

        Lads.forEach(function(lad) {
            lad.integrate();
        });

    }

    function draw() {

        // Clear the fucking canvas you galloping great arsehole
        cx.clearRect(0, 0, w, h);

        // Draw the grid you enormous jumped up twat
        drawGrid();

        if ( _.current ) {
            gfx.fill(_.current, '#4FC1E9');
        }

        for ( var i in blocked ) {
            gfx.fill(blocked[i], _.blocked);
        }

        // Draw the lad
        gfx.dot(lad.pos.x+w/2, lad.pos.y+h/2, 5, _.fg);

        for ( var i in lad.path ) {
            var p = hex_to_pixel(_.layout, lad.path[i]);
            gfx.dot(p.x+w/2, p.y+h/2, 2, _.fg);
        }
    }

    /**
     * 1. Initialise the graphics module with a canvas element
     * 2. Initialise the map module with some map data
     * 3. Give the graphics module a pointer to the map
     *
     * App -> tell the graphics to draw stuff -> Graphics -> Query the map
     */

    function init() {

        gfx.init({
            canvas: c,
            fps: 60
        });

        Map.init({
            gfx: gfx,
            w: w,
            h: h,
            size: 20
        });

        gfx.map(Map);

        $(c).on('mousemove', function(e){
            _.current = Map.pos(e.pageX-(w/2), e.pageY-(h/2));
        });

        $(c).on('click', function(e) {

            // If the lad is travelling, exit early.
            if ( lad.travelling === true ) return false;

            // Perform a search to the hex we clicked on
            atob(lad.pos, Map.pos(e.pageX-(w/2), e.pageY-(h/2)));
        });

        $(doc).on('keydown', function(e){

            if ( e.keyCode === 32 ) {

                // var t = new Set();

                // blocked.forEach(function(i) {
                //     t.add(hex_to_string(i));
                // });

                // if ( t.has(hex_to_string(_.current))) {

                // } else {
                    blocked.push(_.current);
                // }

                // window.requestAnimationFrame(render);
            }

        });

        requestAnimationFrame(render);
    }

    $(init);

})(window,document,document.querySelectorAll('canvas')[0]);
