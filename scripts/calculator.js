/*  SCRIPT NAME : calculator.js
/*  PURPOSE     : BASIC CALCULATOR  */
/*  AUTHOR      : DUNCAN McEWAN  */
/*  DATE        : 22/10/2019  */

/*  INITIALISE VARIABLES  */
/*  calcButtons : Identifies any buttons on the calculator  */
/*  numButtons : Number of buttons on the calculator  */
/*  numString1 : Holds first number for calculation (before maths operator is pressed)  */
/*  numString2 : Holds second number for calculation (after maths operator is pressed)  */
/*  symbol : The mathematical calculation symbol  */
/*  keyPressed : work out which button has been pressed - using the defined classes  */
/*  resultsField : Numbers output area.  Will update as numbers are being typed and on final calculation (use of =)  */

var calcButtons = document.getElementsByClassName("calc-button");
var numButtons = calcButtons.length;
var numString1 = undefined;
var numString2 = undefined;
var symbol = undefined;
var keyPressed = undefined;
var resultField = 0;
var resultFieldLen = 1;
var pointUsed = false;


/*  Loop round all calculator buttons and attach a listener  */
for (var i=0; i< numButtons; i++) {
  calcButtons[i].addEventListener("click", function () {
    keyPressed = this.classList[1];
    processButton(keyPressed);
  } );
};

/*  Add event listener to allow key presses to be used, as well as mouse clicks  */
/*  Using "Keydown" to pick up the "traditional" Windows calc Escape to clear keypress & ENter to equate to "="  */
document.addEventListener("keydown", function(event) {
    processKbClick(event.key);
});


/*  Process Key clicks.  Premise is to convert to "Click Equivalent" and then process the click key as normal, if mouse was used  */
function processKbClick (key) {
  var kbMap = new Map([ [0, "zero"],[1, "one"],[2, "two"],[3, "three"],[4, "four"],[5, "five"],[6, "six"],[7, "seven"],[8, "eight"],[9, "nine"],[".","point"], ["+","plus"],["-","minus"],["*","multiply"],["/","divide"],["=","equals"],["Enter","equals"] ]);
  var validNumbers = ["0","1","2","3","4","5","6","7","8","9"];
  var validSymbols = ["+","-","/","*",".","=","Enter"];
  var validKey = false;

  /*  If clear is pressed, re-initialise variables to a starting point  */
  if (key == "Escape") {
    clear();
  }

  if (validNumbers.includes(key)) {
    key = parseInt(key);
    validKey = true;
  } else if (validSymbols.includes(key)) {
    validKey = true;
  }

  if (validKey && kbMap.has(key)) {
    processButton (kbMap.get(key));
  }

}


function clear() {
  resultField = 0;
  resultFieldLen = 1;
  numString1 = undefined;
  numString2 = undefined;
  symbol = undefined;
  pointUsed = false;
  document.getElementById("results").classList.remove("p-medium");
  document.getElementById("results").classList.remove("p-small");
  document.getElementById("results").innerHTML = resultField;
  return;
}


function fontSizeCheck() {
  /*  Reduce font size in results section to avoid over-run on large numbers  */
  resultFieldLen = document.getElementById("results").innerHTML.length;
  if (resultFieldLen > 19) {
    document.getElementById("results").classList.remove("p-medium");
    document.getElementById("results").classList.add("p-small");
  }
  else if (resultFieldLen > 11) {
    document.getElementById("results").classList.add("p-medium");
  }
}


/***********************************/
/*    PROCESSBUTTON FUNCTION       */
/*    Syntax : processbutton(key)  */
/***********************************/
/*  Called when the event listener detects a key press.  */
/*  Assumptions, Features and Limitations  */
/*    - Handles integer and floating point calculations  */
/*        - Can enter FP numbers as 0.(something) or as .(something) - which will infer the leading zero for you  */
/*    - NOTE - Known Javascript flaw in some decimal calculations (eval and straight calculations are the same)  */
/*        - E.g. 0.3 * 3 returns 0.89999, not 0.9  */
/*    - Currently only handles basic calculations  */
/*        - Number1 'maths operator' Number2 equals  */
/*        - Maths operators handled include addition, subtraction, multiplication, devision  */

function processButton (key) {

  if ((key == "point" || key == ".") && pointUsed) {
    alert("POINT CAN ONLY BE USED ONCE IN A NUMBER");
    return;
  };

  /*  Maps to hold class to value pairs - Classnames cannot start with a number, so this way worked   */
  /*  Also Symbol Map used to convert to actual maths expressions used in final calculation  */
  var numKeyMap = new Map([ ["zero",0],["one",1],["two",2],["three",3],["four",4],["five",5],["six",6],["seven",7],["eight",8],["nine",9],["point","."] ]);
  var symbolMap = new Map([ ["plus","+"],["minus","-"],["multiply","*"],["divide","/"],["equals","="],["Enter","="] ]);

  var dSymb = symbolMap.get(key);
    var dNum = numKeyMap.get(key);

  fontSizeCheck();

  /*  If clear is pressed, re-initialise variables to a starting point  */
  if (key == "clear") {
    clear();
  }


  /*  You need to enter a number before pressing a symbol key - (except "clear")  */
  if (numString1 === undefined && numString2 === undefined && symbolMap.has(key)) {
    alert("You need to press a number before a symbol !");
    return;
  }


  /*  You need to enter two sets of number before pressing the equals key ( = )  */
  if ((numString1 === undefined || numString2 === undefined) && key == "equals") {
    alert("Please enter a set of numbers, a symbol and another set of numbers before pressing =");
    return;
  }

  /*  Process first number "group"  */
  if (numString1 === undefined && numString2 === undefined) {
    if (numKeyMap.has(key) && key == "point") {
      resultField = "0.";
      numString1 = "0.";
      pointUsed = true;
      document.getElementById("results").classList.remove("p-medium");
      document.getElementById("results").classList.remove("p-small");
      document.getElementById("results").innerHTML = resultField;
      fontSizeCheck();
    }
    else if (numKeyMap.has(key)) {
        resultField = numKeyMap.get(key).toString();
        numString1 = numKeyMap.get(key).toString();
        if (key == "point") {
          pointUsed = true;
        }
        document.getElementById("results").classList.remove("p-medium");
        document.getElementById("results").classList.remove("p-small");
        document.getElementById("results").innerHTML = resultField;
        fontSizeCheck();
    }
  }
  else if (numString1 !== undefined && numString2 === undefined  && symbol === undefined) {
    if (numKeyMap.has(key)) {
      resultField += numKeyMap.get(key).toString();
      numString1 += numKeyMap.get(key).toString();
      if (key == "point") {
        pointUsed = true;
      }
      document.getElementById("results").innerHTML = resultField;
      fontSizeCheck();
    }
    else if (symbolMap.has(key)) {
      resultField += symbolMap.get(key).toString();
      symbol = symbolMap.get(key);
      document.getElementById("results").innerHTML = resultField;
      fontSizeCheck();
      pointUsed = false;
    }
  }
  else if (numString1 !== undefined && symbol !== undefined && numString2 === undefined) {
    /*  Process second number "group"  */
    pointUsed = false;
    if (numKeyMap.has(key) && key == "point") {
      resultField += "0.";
      numString2 = "0.";
      pointUsed = true;
      document.getElementById("results").innerHTML = resultField;
      fontSizeCheck();
    }
    else if (numKeyMap.has(key)) {
      resultField += numKeyMap.get(key).toString();
      numString2 = numKeyMap.get(key).toString();
        if (key == "point") {
          pointUsed = true;
        }
        document.getElementById("results").innerHTML = resultField;
        fontSizeCheck();
    }
  }
  else if (numString1 !== undefined && symbol !== undefined && numString2 !== undefined ) {
    if (numKeyMap.has(key)) {
      resultField += numKeyMap.get(key).toString();
      numString2 += numKeyMap.get(key).toString();
      if (key == "point") {
        pointUsed = true;
      }
      document.getElementById("results").innerHTML = resultField;
      fontSizeCheck();
    }
    else if (symbolMap.has(key)  && key == "equals") {
      /*  Process calculation of entered numbers  */
      var myFinal = eval(resultField);
      resultField = myFinal;
      numString1 = undefined;
      numString2 = undefined;
      symbol = undefined;
      pointUsed = false;
      document.getElementById("results").innerHTML = resultField;
    }
  }
  else {
    console.log("SOMETHING ODD HAPPENED!! : NUMSTRING1 - "+numString1+", NUMSTRING2 - "+numString2+"  SYMBOL : "+symbol);
  }

  fontSizeCheck();

  document.getElementById("results").innerHTML = resultField;

}
