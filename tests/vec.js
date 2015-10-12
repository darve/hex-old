
'use strict';

var test    = require('tape'),
    Vec     = require('../app/assets/scripts/modules/Vec.js'),
    M       = require('../app/assets/scripts/modules/Math.js'),

    vecA,
    vecB,
    rand,
    result;

test('Vector addition', function(t){

    var // Run each set of tests three times
        count = 2;

    // Two tests per set
    t.plan(count * 2);

    // Manually add the vector components then check if the library is producting the correct result
    for ( var i = 1; i <= count; i++) {
        vecA = new Vec(M.rand(3, 2), M.rand(3, 2));
        vecB = new Vec(M.rand(3, 2), M.rand(3, 2));

        t.deepEqual(
            vecA.plusNew(vecB),
            {
                x: (vecA.x + vecB.x),
                y: (vecA.y + vecB.y)
            },
            'Floating point: ' + vecA + ' + ' + vecB + ' === ' + vecA.plusNew(vecB)
        );
    }

    for ( var i = 1; i <= count; i++) {
        vecA = new Vec(M.rand(10, 0), M.rand(10, 0));
        vecB = new Vec(M.rand(10, 0), M.rand(10, 0));
        t.deepEqual(vecA.plusNew(vecB), { x: (vecA.x + vecB.x), y: (vecA.y + vecB.y) }, 'Integer: ' + vecA + ' + ' + vecB + ' === ' + vecA.plusNew(vecB));
    }
});

// test('Vector multiplication', function(t){

//     var // Run each set of tests three times
//         count = 2;

//     // Two tests per set
//     t.plan(count * 4);

//     for ( var i = 1; i <= count; i++) {
//         vecA = new Vec(M.rand(3, 2), M.rand(3, 2));
//         rand = M.rand(3, 2);
//         result = vecA.multiplyNew(rand);

//         t.equal(result.x, result.x, 'Floating point: ' + vecA.x + ' * ' + rand + ' === ' + result.x);
//         t.equal(result.y, result.y, 'Floating point: ' + vecA.y + ' * ' + rand + ' === ' + result.y);
//     }

//     for ( var i = 1; i <= count; i++) {
//         vecA = new Vec(M.rand(10, 0), M.rand(10, 0)),
//         rand = M.rand(10, 0);
//         result = vecA.multiplyNew(rand);

//         t.equal(result.x, result.x, 'Integer: ' + vecA.x + ' * ' + rand + ' === ' + result.x);
//         t.equal(result.y, result.y, 'Integer: ' + vecA.y + ' * ' + rand + ' === ' + result.y);
//     }
// });

// test('Vector normalisation', function(t) {
//     vecA = new Vec(M.rand(3, 2), M.rand(3, 2));
//     vecB = new Vec(M.rand(3, 2), M.rand(3, 2));

//     t.
// });
