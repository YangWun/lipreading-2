var firebase = new Firebase("https://lips.firebaseio.com/");

function initializeCalMatList() {
  var calMatListRef = firebase.child("calibrationMatrixList");
  calMatListRef.once('value', function(snapshot) {
    var calMatList = snapshot.val();
    if (calMatList) {
      console.log('already initialized calibrationMatrixList');
    }
    else {
      calMatList = [];
      calMatList[0] = false;
      calMatListRef.set(calMatList);
    }
  });
}

var makeSaveCalibrationMatrix = function(word, matrix) {
  var invoked = false;
  var saveCalibrationMatrix = function() {
    if (invoked) {
      console.log("saveCalibrationMatrix may only be invoked once");
    }
    else {
      var calMatListRef = firebase.child("calibrationMatrixList");
      calMatListRef.once('value', function(snapshot) {
        var calMatList = $.map(snapshot.val(), function(value, index) {
                           return [value];
                         });
        var nextItem = calMatList.length;
        var jsonObj = {
          word: word,
          matrix: matrix
        };
        // jsonObj[word] = matrix;
        calMatList[nextItem] = jsonObj;
        calMatListRef.set(calMatList);
      });
      invoked = true;
    }
    return invoked;
  };
  return saveCalibrationMatrix;
};

var askSaveCalibrationMatrix = function(word, matrix) {
  var saved;
  var QUESTION_TEXT = "Save calibration matrix for word: " + word;
  var saveCalMat = makeSaveCalibrationMatrix(word, matrix);
  var userAnswer = confirm(QUESTION_TEXT);

  if (userAnswer) {
    saveCalMat();
    saved = true;
  }
  else {
    saved = false;
  }
  return saved;
}

function refDataOnce(ref, cback, errCback) {
  ref.once('value', cback, errCback);
}

function getWordsFromCalMatList(callback, errCback) {
  var calibrationMatrixListRef = firebase.child('calibrationMatrixList');
  refDataOnce(calibrationMatrixListRef, callback, errCback);
}

function calMatList2WordList(calMatList) {
  var len = calMatList.length;
  var wordList = [];
  for (var matrixInd = 1; matrixInd < len; matrixInd++) {
    wordList[matrixInd - 1] = calMatList[matrixInd].word;
  }
  return wordList;
}