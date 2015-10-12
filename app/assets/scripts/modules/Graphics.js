

"use strict";

var H       = require('./Hex'),
    Vec     = require('./Vec');


/**
 * Responsibilities of this module:
 *
 * Hold the PIXI containers that represent the different pieces of the app.
 */
module.exports = (function(){

    var

        w = win.innerWidth,
        h = win.innerHeight,

        c, // Canvas
        cx, // Rendering context

        // These all relate to the resolution of the canvas
        devicePixelRatio,
        backingStoreRatio,
        ratio,

        // The default FPS
        fps = 60,

        map,

        // These are all used for the main rendering loop
        now,
        then = Date.now(),
        interval = 1000/fps,
        delta,

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
        ];

    /**
     * Primitive drawing functions below this point
     */
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
        reset();
    }

    function line(x1, y1, x2, y2, c) {
        cx.strokeStyle = c;
        cx.beginPath();
        cx.moveTo(x1, y1);
        cx.lineTo(x2, y2);
        cx.stroke();
    }

    /**
     * Hex related drawing stuffs
     */

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

    function drawHexLabel(hex) {
        var center = hex_to_pixel(_.layout, hex);
        cx.fillStyle = '#5D9CEC';
        cx.font = "10px sans-serif";
        cx.textAlign = "center";
        cx.textBaseline = "middle";
        cx.fillText((hex.q == 0 && hex.r == 0 && hex.s == 0)? "q,r,s" : (hex.q + "," + hex.r + "," + hex.s), center.x, center.y);
    }

    function reset() {
        cx.setTransform(1, 0, 0, 1, 0, 0);
    }

    /**
     * Used to limit the frames per second the app runs at.
     */
    function render(cb) {
        now = Date.now();
        delta = now - then;

        if (delta > interval) {
            then = now - (delta % interval);
            cb();
        }
    }

    function init(opts) {

        // This is the actual rendering context that we will be drawing to
        c = opts.canvas;
        fps = opts.fps;

        cx = c.getContext('2d');

        devicePixelRatio = window.devicePixelRatio || 1;
        backingStoreRatio = cx.webkitBackingStorePixelRatio ||
                            cx.mozBackingStorePixelRatio ||
                            cx.msBackingStorePixelRatio ||
                            cx.oBackingStorePixelRatio ||
                            cx.backingStorePixelRatio || 1;

        ratio = devicePixelRatio / backingStoreRatio;

        c.width = w;
        c.height = h;

        cx.lineWidth = 1;
        cx.fillStyle = 0x555555;
        cx.strokeStyle = 0x555555;

        /**
         * Create the pixi stage and renderer and add them to the
         * page
         */
        // stage = new PIXI.Container();
        // renderer = new PIXI.WebGLRenderer(w, h, { backgroundColor: 0xDDDDDD});
        // document.body.appendChild(renderer.view);

        /**
         * Begin game asset load
         */
        // loader = PIXI.loader;
        // loader.add('horse', '/assets/img/graphics/3606.png');
        // loader.once('complete', worldInit);
        // loader.load();

    }

    function map(m) {

    }

    return {
        colours: colours,
        randomColour: randomColour,
        dot: dot,
        line: line,

        init: init,
        map: map,
        render: render
    };

})();
