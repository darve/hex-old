
"use strict";

/**
 * A bunch of helper functions
 */
module.exports = function() {

    var _ = this;

    _.contains = function(arr, val) {
        for ( var i in arr ) {
            if ( arr[i] === val ) {
                return true;
            }
        }
        return false;
    }

    _.index = function(arr, val){
        for ( var i in arr ) {
            if ( arr[i] === val ) {
                return i;
            }
        }

        return -1;
    }

    // Simple extend function - iterates through all the properties of the second
    // argument object and adds them / overwrites them on the first argument
    _.extend = function(obj, ext) {

        for (var prop in ext) {
            obj[prop] = (obj.hasOwnProperty(prop)) ? obj[prop] : ext[prop];
        }
        return obj;

    };

    return _;

}
