/**
 * Created by antoine on 10/03/16.
 */

var A = [];
A[0] = -1;
A[1] = 3;
A[2] = -4;
A[3] = 5;
A[4] = 1;
A[5] = -6;
A[6] = 2;
A[7] = 1;
A[8] = 1;

function add(a, b) {
  return a + b;
}

var algo = function(A) {
  this.A = A;

  var check = function(A, index) {
    //var tmp = JSON.parse(JSON.stringify(A));
    var tmp = A;
    console.log('Calling Check with A = ', A);
    var arrLeft = tmp.splice(0,index);
    tmp.splice(0,1);
    console.log('Array Left = ', arrLeft);
    console.log('Array Right = ', tmp);

    var sumLeft = arrLeft.reduce(add, 0);
    var sumRight = tmp.reduce(add, 0);
    console.log('Sunleft = ', sumLeft);
    console.log('SumRight = ', sumRight, '\n\n');
    return sumLeft === sumRight;
  }

  var solution = function(A) {
    for(var i=0; i<A.length-1; i++) {
      console.log('checking index ', i, 'with array ', A);
      if (check(A, i) ===true) {
        return i;
      }
    }
    return -1;
  }

  this.solution = function() {
    solution(this.A);
  }

}


function check(A, index) {
  var tmp = JSON.parse(JSON.stringify(A));
  console.log('Calling Check with A = ', A);
  var arrLeft = tmp.splice(0,index);
  tmp.splice(0,1);
  console.log('Array Left = ', arrLeft);
  console.log('Array Right = ', tmp);

  var sumLeft = arrLeft.reduce(add, 0);
  var sumRight = tmp.reduce(add, 0);
  console.log('Sunleft = ', sumLeft);
  console.log('SumRight = ', sumRight, '\n\n');
  return sumLeft === sumRight;
}

function solution(A) {
  var sol = new algo(A);
  return sol.solution();
}

console.log(solution(A));