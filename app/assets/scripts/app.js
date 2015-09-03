
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
            hexes: undefined,
            layout: undefined,
            size: 22
        };

    cx.lineWidth = 1;
    cx.fillStyle = 0x555555;
    cx.strokeStyle = 0x555555;

    function randomColour() {
        return colours[Math.floor(Math.random() * colours.length)];
    }

    function dot(x,y,r, c){
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
        // window.requestAnimationFrame(render);
    }

    function init() {

        c.width = w;
        c.height = h;

        _.fill = randomColour();

        _.layout = Layout(layout_pointy, Point(_.size, _.size), Point(0, 0));
        _.hexes = shapeRectangle(w/_.size, h/_.size, permuteQRS);
        drawGrid("hsl(60, 10%, 90%)", true);

        $(c).on('mousemove', function(e){
            // console.log(
            //     parseInt(e.pageX+(w/2)), 
            //     parseInt(e.pageY+(h/2))
            // );
            
            var lol = hex_round(
                pixel_to_hex(
                    _.layout, { x: e.pageX-(w/2), y: e.pageY-(h/2) }));

            console.log(lol);
            var corners = polygon_corners(_.layout, lol);
            cx.beginPath();
            // cx.strokeStyle = "black";
            // cx.fillStyle = _.fill;
            cx.fillStyle = 'rgba(' + (lol.q*10) + ', ' + (lol.r*10) + ', ' + (lol.s*10) + ', 1)';
            cx.lineWidth = 1;
            cx.moveTo(corners[5].x, corners[5].y);

            for (var i = 0; i < 6; i++) {
                cx.lineTo(corners[i].x, corners[i].y);
            }

            cx.stroke();
            cx.fill();

        });
        // window.requestAnimationFrame(render);
    }

    function fillHex( hex ) {
        var corners = polygon_corners(_.layout, hex);
        cx.beginPath();
        // cx.strokeStyle = "black";
        cx.fillStyle = randomColour();
        cx.lineWidth = 1;
        cx.moveTo(corners[5].x, corners[5].y);

        for (var i = 0; i < 6; i++) {
            cx.lineTo(corners[i].x, corners[i].y);
        }

        cx.stroke();
        cx.fill();
    }

    function shapeRectangle(w, h, constructor) {
        var hexes = [];
        var i1 = -Math.floor(w/2), i2 = i1 + w;
        var j1 = -Math.floor(h/2), j2 = j1 + h;
        for (var j = j1; j < j2; j++) {
            var jOffset = -Math.floor(j/2);
            for (var i = i1 + jOffset; i < i2 + jOffset; i++) {
                hexes.push(constructor(i, j, -i-j));
            }
        }
        return hexes;
    }


    function drawGrid(backgroundColor, withLabels) {
        
        cx.fillStyle = backgroundColor;
        cx.fillRect(0, 0, w, h);
        cx.translate(w/2, h/2);
        _.hexes.forEach(function(hex) {
            // console.log(hex);
            drawHex(cx, hex);
            // if (withLabels) drawHexLabel(cx, hex);
        });
    }

    function permuteQRS(q, r, s) { return Hex(q, r, s); }

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


    function colorForHex(hex) {
        // Match the color style used in the main article
        if (hex.q == 0 && hex.r == 0 && hex.s == 0) {
            return "hsl(0, 50%, 0%)";
        } else if (hex.q == 0) {
            return "hsl(90, 70%, 35%)";
        } else if (hex.r == 0) {
            return "hsl(200, 100%, 35%)";
        } else if (hex.s == 0) {
            return "hsl(300, 40%, 50%)";
        } else {
            return "hsl(0, 0%, 50%)";
        }
    }


    function drawHexLabel(ctx, hex) {
        var center = hex_to_pixel(_.layout, hex);
        ctx.fillStyle = colorForHex(hex);
        ctx.font = "12px sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText((hex.q == 0 && hex.r == 0 && hex.s == 0)? "q,r,s" : (hex.q + "," + hex.r + "," + hex.s), center.x, center.y);
    }


    $(init);

})(window,document,document.querySelectorAll('canvas')[0]);