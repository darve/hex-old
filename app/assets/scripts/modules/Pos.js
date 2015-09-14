module.exports = (function() {

    var Pos = function(layout, h) {

        var _ = this,
            hex,
            vec;

        _.go = function(h, v) {

        };

        hex = h,
        vec = hex_to_pixel(layout, hex);

        return {
            hex: hex,
            vec: vec
        };
    }

    return Pos;
})();
