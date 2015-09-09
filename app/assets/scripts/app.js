
/**
 * Smash targets below this line
 * -----------------------------
 */

(function(win, doc, c) {

    var cx = c.getContext('2d'),
        w = win.innerWidth,
        h = win.innerHeight,

        // Some rad colours, should we need any.
        colours = [
            '#ed5565',
            '#da4453',
            '#fc6e51',
            '#e9573f',
            '#ffce54',
            '#fcbb42',
            '#a0d468',
            '#8cc152',
            '#48cfad',
            '#37bc9b',
            '#4fc1e9',
            '#3bafda',
            '#5d9cec',
            '#4a89dc',
            '#ac92ec',
            '#967adc',
            '#ec87c0',
            '#d770ad',
            '#f5f7fa',
            '#e6e9ed',
            '#ccd1d9',
            '#aab2bd',
            '#656d78',
            '#434a54'
        ],

        _ = {
            bg: "#F5F7FA",
            fg: "#FFCE54",
            txt: "#656D78",
            blocked: "#434A54",
            hexes: undefined,
            layout: undefined,
            size: 22,
            current: undefined
        },

        lad = {
            pos: new Vec(0, 0),
            dir: new Vec(0, 0),
            last: undefined,
            next: undefined,
            target: undefined,
            current: undefined,
            path: []
        },

        blocked = [
            Hex(0, -2, 2),
            Hex(1, -2, 1),
            Hex(2, -2, 0),
            Hex(3, -2, -1),
            Hex(3, -1, -2),
            Hex(3, 0, -3),
            Hex(2, 1, -3),
            Hex(1, 1, -2),
            Hex(0, 1, -1),
            Hex(-1, 1, 0),
        ],

        _blocked = new Set(),

        fps = 60,
        now,
        then = Date.now(),
        interval = 1000/fps,
        delta,

        frontier,
        visited,
        came_from,
        k = 0;

    window.lad = lad;
    window.blocked = blocked;
    window._blocked = _blocked;

    cx.lineWidth = 1;
    cx.fillStyle = 0x555555;
    cx.strokeStyle = 0x555555;

    function randomColour() {
        return colours[Math.floor(Math.random() * colours.length)];
    }

    function dot(x,y,r,c){
        cx.translate(x, y);
        cx.strokeStyle = c;
        cx.fillStyle = c;
        cx.beginPath();
        cx.arc(0, 0, r*2, 0, 2 * Math.PI, false);
        cx.closePath();
        cx.fill();
        cx.setTransform(1, 0, 0, 1, 0, 0);
    }

    function line(x1, y1, x2, y2, c) {
        cx.strokeStyle = c;
        cx.beginPath();
        cx.moveTo(x1, y1);
        cx.lineTo(x2, y2);
        cx.stroke();
    }

    function render() {

        requestAnimationFrame(render);
        now = Date.now();
        delta = now - then;

        if (delta > interval) {
            then = now - (delta % interval);
            integrate();
            draw();
        }
    }


    function integrate() {
        if ( lad.path.length ) {
            if ( lad.pos.isCloseTo( lad.target, 2 ) ) {
                lad.current = lad.next;
                lad.pos = lad.target;
                lad.next = lad.path.pop();
                lad.target = point_to_vec(hex_to_pixel(_.layout, lad.next));
            } else {
                lad.dir = lad.target.minusNew(lad.pos).normalise().multiplyEq(4);
                lad.pos.plusEq(lad.dir);
            }
        } else if ( lad.target !== undefined ) {
            // The lad has finished his journey
            // console.log('The lad has finished his journey');
            lad.pos = lad.target;
            lad.target = undefined;
            lad.travelling = false;
        }
    }

    function draw() {

        // Clear the fucking canvas you galloping great arsehole
        cx.clearRect(0, 0, w, h);

        // Draw the grid you enormous jumped up twat
        drawGrid();

        if ( _.current ) {
            fill(_.current, '#4FC1E9');
        }

        for ( var i in blocked ) {
            fill(blocked[i], _.blocked);
        }


        // Draw the lad
        dot(lad.pos.x+w/2, lad.pos.y+h/2, 5, _.fg);

        for ( var i in lad.path ) {
            var p = hex_to_pixel(_.layout, lad.path[i]);
            dot(p.x+w/2, p.y+h/2, 2, _.fg);
        }
    }

    function init() {

        c.width = w;
        c.height = h;

        _.layout = Layout(layout_pointy, Point(_.size, _.size), Point(0, 0));
        _.hexes = generateGrid(w/_.size, h/_.size);

        $(c).on('mousemove', function(e){
            var lol = hex_round(pixel_to_hex(_.layout, { x: e.pageX-(w/2), y: e.pageY-(h/2) }));
            _.current = lol;
        });

        $(c).on('click', function(e) {

            // If the lad is travelling, exit early.
            if ( lad.travelling === true ) return false;

            // Get the hex we clicked on
            var lol = hex_round(pixel_to_hex(_.layout, { x: e.pageX-(w/2), y: e.pageY-(h/2) }));

            _.clicked = lol;

            atob(lad.pos, lol);
        });

        $(doc).on('keydown', function(e){

            if ( e.keyCode === 32 ) {
                blocked.push(_.current);
                // window.requestAnimationFrame(render);
            }

        });

        requestAnimationFrame(render);
    }

    function atob(start, end) {

        var s,
            path,
            node,
            temp;

        s = new search(hex_round(pixel_to_hex(_.layout, lad.pos)), 32);

        // Reconstruct path to mouseover position
        path = [];
        node = end;
        path.push(end);

        while (node != null) {
            path.push(hex_round(node));
            node = s.came_from[hex_to_string(node)];
        }

        lad.path = path;
        lad.target = point_to_vec(hex_to_pixel(_.layout, lad.path.pop()));
        lad.next = lad.path[lad.path.length-1];
        lad.travelling = true;
    }

    function search(start, movement, goal) {

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
                        // console.log('valid', neighbor);
                        // fill(neighbor, '#000');
                    }
                }
            }
        }

        return { came_from: came_from };
    }

    function hex_to_string(hex) {
        return hex.q + ',' + hex.r + ',' + hex.s;
    }

    function string_to_hex(str) {
        var q = str.split(',');
        return Hex(q[0], q[2], q[4]);
    }

    function point_to_vec(h) {
        return new Vec(h.x, h.y);
    }

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

    function drawGrid() {
        cx.fillStyle = _.bg;
        cx.fillRect(0, 0, w, h);
        cx.translate(w/2, h/2);
        _.hexes.forEach(function(hex) {
            drawHex(hex);
            // drawHexLabel(hex);
        });
        cx.setTransform(1, 0, 0, 1, 0, 0);
    }

    function drawHex(hex) {
        var corners = polygon_corners(_.layout, hex);
        cx.beginPath();
        cx.strokeStyle = "rgba(0, 0, 0, 0.2)";
        cx.lineWidth = 1;
        cx.moveTo(corners[5].x, corners[5].y);
        for (var i = 0; i < 6; i++) {
            cx.lineTo(corners[i].x, corners[i].y);
        }
        cx.stroke();
    }

    function fill(hex, c) {
        cx.translate(w/2, h/2);
        corners = polygon_corners(_.layout, hex);

        cx.beginPath();
        cx.fillStyle = c;
        cx.moveTo(corners[5].x, corners[5].y);

        for (var i = 0; i < 6; i++) {
            cx.lineTo(corners[i].x, corners[i].y);
        }

        cx.fill();
        cx.setTransform(1, 0, 0, 1, 0, 0);
    }

    window.fill = fill;

    function drawHexLabel(hex) {
        var center = hex_to_pixel(_.layout, hex);
        cx.fillStyle = '#5D9CEC';
        cx.font = "10px sans-serif";
        cx.textAlign = "center";
        cx.textBaseline = "middle";
        cx.fillText((hex.q == 0 && hex.r == 0 && hex.s == 0)? "q,r,s" : (hex.q + "," + hex.r + "," + hex.s), center.x, center.y);
    }

    $(init);

})(window,document,document.querySelectorAll('canvas')[0]);
