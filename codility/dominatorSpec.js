/**
 * Created by antoine on 13/03/16.
 */
var chai = require('chai');
var assert = chai.assert;


function getDominator(A) {
  var len = A.length, i;
  A.sort(function(a, b) {
    return a===b ? 0  : ( a > b ? 1 : -1);
  });

  var currentVal = A[0];
  var nbCurrentVal = 1;
  var max = 0;
  var nbMax = 0;
  var denominatorIndex = null;

  for(i=1; i<len; i++) {
    if (A[i] !== currentVal) {
      currentVal = A[i];
      if ( nbCurrentVal > max) {
        max = nbCurrentVal;
        denominatorIndex = i-1;
        nbCurrentVal = 1;
        nbMax = 1;
      } else if (nbCurrentVal === max) {
        nbMax++;
      }
    } else {
      nbCurrentVal ++;
    }
  }
  return nbMax === 1 ? denominatorIndex : -1;

}

function solution(A) {
  // write your code in JavaScript (Node.js 4.0.0)
  return getDominator(A);
}


var tests = [
  {
    input: [1, 2, 3, 4, 5],
    expected: -1
  },
  {
    input: [2, 2,2, 2, 2],
    expected: -1
  },
  {
    input: [1, 2,2, 4, 4],
    expected: 4
  },
  {
    input: [1, 1,1, 2, 3],
    expected: 2
  },
  {
    input: [1, 2, 3, 2, 3],
    expected: -1
  },
  {
    input: [1, 2, 3, 3, 3],
    expected: 4
  },
];

describe('Testing ', function () {
  var input, expected, result;

  for (var i in tests) {

    beforeEach(function() {
      input = tests[i]['input'];
      expected = tests[i]['expected'];
      result = solution(input);
    });

    it('should equal ' + JSON.stringify(expected), function () {
      assert.equal(result, expected,  'for input ' + JSON.stringify(input));
    });
  }

});
