/**
 * Created by antoine on 10/03/16.
 */
var A = [1,2,3];

function calculateSum(A, i) {
  A.splice(0,i);
  console.log('calculating sum for ', A);
  return A.reduce(add, 0);
}

var add = function(a, b) {
  return a + b;
}

var test = function(A) {
  var sums = [];
  for ( var i=0; i < A.length ; i++ ) {
    console.log('calling calculate sum for i = ', i, A);
    sums.push(calculateSum(A, i));
  }
  return sums;
}

console.log( test(A));
