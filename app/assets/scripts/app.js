
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
            hexes: undefined,
            layout: undefined,
            size: 22,
            current: undefined
        },

        lad = {
            pos: new Vec(0, 0),
            target: undefined,
            currentHex: new Hex(0, 0, 0),
            path: []
        };

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

    function render(){
        cx.clearRect(0, 0, w, h);
        drawGrid();
        dot(lad.pos.x+w/2, lad.pos.y+h/2, 2, _.fg);
        
        // if ( lad.target !== undefined ) {
        //     lad.pos = lad.pos.plusEq(lad.target.normalise());    
        // }
        

        if ( lad.path.length ) {
            if ( lad.pos.isCloseTo( lad.target, 0.3 ) ) {
                console.log('node reached');
                lad.pos = lad.target;
                lad.target = hex_to_pixel(_.layout, lad.path.shift());
                lad.target = new Vec(lad.target.x, lad.target.y);
            } else {
                console.log('travelling', lad.pos.x, lad.pos.y, lad.target.x, lad.target.y);
                lad.pos = lad.pos.plusEq(lad.target.normalise()).divideEq(6);
                lad.pos.x = lad.pos.x.toFixed(3);
                lad.pos.y = lad.pos.y.toFixed(3);
            }
        }

        // if ( _.current !== undefined ) {
        //     fill(_.current);    
        // }
        // window.requestAnimationFrame(render);
    }

    function init() {

        c.width = w;
        c.height = h;

        _.layout = Layout(layout_pointy, Point(_.size, _.size), Point(0, 0));
        _.hexes = generateGrid(w/_.size, h/_.size);
        // drawGrid();

        $(c).on('mousemove', function(e){
            var lol = hex_round(pixel_to_hex(_.layout, { x: e.pageX-(w/2), y: e.pageY-(h/2) }));

            _.current = lol;
        });

        $(c).on('click', function(e) {

            // Get the hex we clicked on
            var lol = hex_round(pixel_to_hex(_.layout, { x: e.pageX-(w/2), y: e.pageY-(h/2) }));

            _.clicked = lol;

            var s = search(Hex(0, 0, 0), 32);

            // Reconstruct path to mouseover position
            var path = [];
            var node = lol;

            while (node != null) {
                path.push(node);
                node = s.came_from[hex_to_string(node)];
            }

            // lad.target = hex_to_pixel(_.layout, lol);
            // lad.target = new Vec(lad.target.x, lad.target.y);

            lad.path = path;
            lad.target = hex_to_pixel(_.layout, lad.path.shift());
            lad.target = new Vec(lad.target.x.toFixed(3), lad.target.y.toFixed(3));

            // for ( var i in path ) {
                // console.log(hex_to_pixel(_.layout, path[i]));
                // fill( path[i] );
            // }
        });

        $(doc).on('keydown', function(e){

            console.log(e.keyCode);

            if ( e.keyCode === 32 ) {
                window.requestAnimationFrame(render);
            }

        });


        window.requestAnimationFrame(render);
    }

    function breadthFirstSearch(start, maxMovement) {
        /* see http://www.redblobgames.com/pathfinding/a-star/introduction.html */
        var cost_so_far = d3.map(); cost_so_far.set(start, 0);
        var came_from = d3.map(); came_from.set(start, null);
        var fringes = [[start]];

        for (var k = 0; k < maxMovement && fringes[k].length > 0; k++) {
            fringes[k+1] = [];
    
            fringes[k].forEach(function(hex) {
                for (var dir = 0; dir < 6; dir++) {
                    
                    var neighbor = hex_neighbor(hex, dir);

                    if (!cost_so_far.has(neighbor)) {
                        console.log('omg');
                        cost_so_far.set(neighbor, k+1);
                        came_from.set(neighbor, hex);
                        fringes[k+1].push(neighbor);
                    }
                }
            });
        }
        return {cost_so_far: cost_so_far, came_from: came_from};
    }

    function search( start, movement ) {

        // Used for storing unique hexes so we know which ones we have visited.
        var visited = new Set();
        visited.add(hex_to_string(start));

        // An array of the hexes in the outskirts of our search.
        var frontier = [[start]];

        // A proper list of where we have come from
        var came_from = {};
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
                    if (!visited.has(hex_to_string(neighbor))) {
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

    function unique(arr, item) {
        for ( var i in arr ) {
            if ( arr[i] === item ) {
                return false;
            }
        }
        return true;
    }

    function hex_to_string(hex) {
        return hex.q + ',' + hex.r + ',' + hex.s;
    }

    function string_to_hex(str) { 
        console.log(str);
        var q = str.split(',');
        return Hex(q[0], q[2], q[4]);
    }

    function fill(temp) {
        cx.translate(w/2, h/2);
        corners = polygon_corners(_.layout, temp);

        cx.beginPath();
        cx.fillStyle = _.fg;
        cx.moveTo(corners[5].x, corners[5].y);

        for (var i = 0; i < 6; i++) {
            cx.lineTo(corners[i].x, corners[i].y);
        }

        cx.fill();
        cx.setTransform(1, 0, 0, 1, 0, 0);
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
            drawHex(cx, hex);
        });
        cx.setTransform(1, 0, 0, 1, 0, 0);
    }

    function drawHex(ctx, hex) {
        var corners = polygon_corners(_.layout, hex);
        ctx.beginPath();
        ctx.strokeStyle = "rgba(0, 0, 0, 0.2)";
        ctx.lineWidth = 1;
        ctx.moveTo(corners[5].x, corners[5].y);
        for (var i = 0; i < 6; i++) {
            ctx.lineTo(corners[i].x, corners[i].y);
        }
        ctx.stroke();
    }


    $(init);

})(window,document,document.querySelectorAll('canvas')[0]);