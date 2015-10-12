
'use strict';

module.exports = (function() {

    function rand(num, dec) {
        var random = Math.random() * num;
        return Number(random.toFixed(dec));
    }

    return {
        rand: rand
    };
})();
