window.onload  = function() {
  // grabbing global static DOM vars
  var inputs = document.getElementsByTagName('input');
  var button = document.getElementById('blurbutton');
  var letterTimer = 0;
  var blurTimer = 0;
  // move bottom row between top row
  function squeeze(DOM) {
    if (DOM.middle.offsetWidth > DOM.between.offsetWidth) {
      DOM.secondDiv.classList.add('squeeze');
    } else {
      DOM.secondDiv.classList.remove('squeeze');
    }
  }
  // grab DOM elements on demand
  function getDom() {
    return {
    'first' : document.querySelector('.first'),
    'last' : document.querySelector('.last'),
    'middle' : document.querySelector('.middle'),
    'between' : document.querySelector('.between'),
    'firstDiv' : document.getElementById('firstDiv'),
    'secondDiv' : document.getElementById('secondDiv'),
    'dashes' : document.getElementsByClassName('dash')
    };
  }
  /**
  * If the second row is an empty string, need to replace with a filler char
  */
  function handleBlank(text, DOM) {
    if (text === '') {
      DOM.between.classList.add('invisible');
      text = 'X'
    } else {
      DOM.between.classList.remove('invisible');
    }
    return text;
  }
  /*
  * take text from inputs OR url and add to DOM
  */
  function handleText(text,id) {
    text = text.trim(); // strip whitespace
    var len = text.length,
        DOM = getDom(),
        middleText = '';
    if (id === 'first') { // firstDiv text, top row
      if (len < 3) { // for 0, 1, or 2 character strings, don't capitalize
        DOM.first.textContent = '';
        DOM.last.textContent = '';
        middleText = text;
        DOM.middle.classList.add('lonely');
      } else { // loop over text string
        DOM.middle.classList.remove('lonely');
        for (var i = 0; i < len; i++) {
          if (i === 0) { //first char
            DOM.first.textContent = text[i]
          } else if (i === len - 1) { //last char
            DOM.last.textContent = text[i]
          } else { //other chars
            middleText += text[i]
          }
        }
      }
      spanifyText(middleText, DOM.middle);
    } else { // secondDiv text, bottom row
      text = handleBlank(text,DOM); // if blank
      DOM.between.textContent = text;
      spanifyText(text, DOM.between);
    }
    squeeze(DOM);
  }

  // check keycodes for valid printable characters (or return/backspace)
  function isValidKey(key) {
    return ((key > 47 && key < 58) || //numbers
          key === 13 || //return
          (key > 64 && key < 91) || //letters
          (key > 185 && key < 193) || (key > 218 && key < 223) || //special chars
          key === 8); //backspace
  }

  // get text and id on keyup
  function getValue(e) {
    if (isValidKey(e.keyCode)) {
      var text = this.value,
            id = this.id;
      handleText(text,id);
      grabCoordinates();
      applyAnimations();
    }
  }

  function spanifyText(text, row){
    var splitText = text.split('');
    var textLength = text.length;

    row.textContent = '';
    for (var i = 0; i < textLength; i++)
    {
      var letterSpan = document.createElement('span');
      letterSpan.classList.add('minor_letter');
      letterSpan.textContent = splitText[i];
      row.appendChild(letterSpan);
    }
  }

  // added param to make DRYer - noah 8/22/16 1AM
  function resizeLine(name,left,top,width) {
    var line = document.querySelector('.'+name+'-line');
    line.setAttribute("x", left);
    line.setAttribute("y", top);
    // short lines look weird on the sides, thus:
    if (name !== 'top') {
      width = (width < 20) ? 0 : width;
    }
    line.setAttribute("width", width);
    var height = (window.innerWidth <= 550) ? 4 : 8;
    line.setAttribute("height", height);
  }


  function grabCoordinates(){
    //###
    //Grab coordinates of text div boxes
    //###
    var first_div = document.querySelector('#firstDiv');
    var second_div = document.querySelector('#secondDiv');
    var first_rect = first_div.getBoundingClientRect();
    var second_rect = second_div.getBoundingClientRect();
    var first_div_width = (first_rect.right - first_rect.left);
    var second_div_width = (second_rect.right - second_rect.left);
    //###
    //Check if first div is longer than second div
    //If so, then we'll style the left and right lines differently
    //###
    var is_first_div_longer = first_div_width > second_div_width ? true : false;

    //###
    //If first div's width (text) is longer, lines extend from the ends of the second div
    //else, the lines extend from the end of the first div
    //###
    var left_line_left = is_first_div_longer ? first_rect.left : second_rect.left;
    var left_line_width = is_first_div_longer ? (second_rect.left - first_rect.left) : (first_rect.left - second_rect.left);
    var right_line_right = is_first_div_longer ? second_rect.right : first_rect.right;
    var right_line_width = is_first_div_longer ? (first_rect.right - second_rect.right) : (second_rect.right - first_rect.right);

    var topDifference = document.querySelector('.middle').getBoundingClientRect().top - document.querySelector('.first').getBoundingClientRect().top;
    var bottomDifference = (first_rect.bottom - second_rect.top) / 2;
    var marginOffset = is_first_div_longer ? (first_rect.bottom - bottomDifference + 8) : (first_rect.bottom - 2 * bottomDifference);

    resizeLine('top', first_rect.left, (first_rect.top + topDifference), first_div_width);
    resizeLine('left', left_line_left, marginOffset, left_line_width);
    resizeLine('right', right_line_right, marginOffset, right_line_width);

  }

  function applyAnimations(){
    window.clearTimeout(letterTimer);
    var firstLetter = document.querySelector(".first");
    var lastLetter = document.querySelector(".last");
    var minorLetters = document.getElementsByClassName('minor_letter');
    var topLine = document.querySelector('.top-line');
    var left_line = document.querySelector('.left-line');
    var right_line = document.querySelector('.right-line');
    var animations = ['enter-top','enter-bottom','enter-left','enter-right'];
    var randomAnimation;
    var chosenAnimation; //To make sure previous animation is not chosen twice.

    var overallAnimationTime = 5010; //Total animation lasts <5000ms

    firstLetter.style.position = 'relative';
    lastLetter.style.position = 'relative';
    topLine.style.display = "none"; //Set lines invisible before animation
    left_line.style.display = "none";
    right_line.style.display = "none";
    firstLetter.classList.remove('enter-left-slow');
    lastLetter.classList.remove('enter-right-slow');
    topLine.classList.remove('flash-line');
    left_line.classList.remove('flash-line');
    right_line.classList.remove('flash-line');
    Array.prototype.forEach.bind(minorLetters)(function(letter) {
      letter.style.position = 'relative';
      letter.style.opacity = '0'; //Make letters invisible before animation is triggered
      letter.className = "minor_letter";
    });
    window.setTimeout(function(){
      firstLetter.classList.add('enter-left-slow');
      lastLetter.classList.add('enter-right-slow');
      Array.prototype.forEach.bind(minorLetters)(function(letter) {
        //###
        //Animation start trigger - random value from 0 - 2000 ms
        //Animation lasts 3000ms when triggered
        //Overall Animation Time = <5000ms
        //###
        var randomStartTime = Math.floor(Math.random() * 2001);

        //###
        //Random non-repeating animation assignment
        //###
        setTimeout(function(){
          while (chosenAnimation === randomAnimation) {
            randomAnimation = Math.floor(Math.random() * animations.length);
          }
          chosenAnimation = randomAnimation;

          letter.classList.add(animations[randomAnimation]);
          letter.style.opacity = '1';//Make visible when animations start
        },randomStartTime)
    });
    },10);

    letterTimer = window.setTimeout(function() {
      firstLetter.style.position = 'static';
      lastLetter.style.position = 'static';
      Array.prototype.forEach.bind(minorLetters)(function(letter) {
      letter.style.position = 'static';
      setTimeout(function(){
        topLine.classList.add('flash-line');
        topLine.style.display = "initial";

      },10)
      setTimeout(function(){
        right_line.classList.add('flash-line');
        left_line.classList.add('flash-line');
        left_line.style.display = "initial";
        right_line.style.display = "initial";
      },750)
    });
    },overallAnimationTime)
  }

  /**
  * Reset animations and blur on button click
  */
  function reAnimate() {
    window.clearTimeout(blurTimer);
    grabCoordinates();
    applyAnimations();
    var blurred = document.querySelectorAll('#firstDiv,#secondDiv');
    Array.prototype.forEach.bind(blurred)(function(el) {
      el.classList.remove('blurry_animate');
      blurTimer = window.setTimeout(function(el) {
        el.classList.add('blurry_animate');
      }, 10, el)
    });
  }

  function listenToMe() {
    inputs[0].addEventListener('keyup',getValue)
    inputs[1].addEventListener('keyup',getValue)
    button.addEventListener('click',reAnimate)
    if (inputs[0].value !== "STRANGER") {
      handleText(inputs[0].value,inputs[0].id)
      handleText(inputs[1].value,inputs[1].id)
    }
    window.onresize = grabCoordinates;
  }

  spanifyText('trange', document.querySelector('.middle')); //In lieu of spanning them in HTML template
  spanifyText('things', document.querySelector('.between')); //In lieu of spanning them in HTML template
  listenToMe();
  grabCoordinates();
  applyAnimations();
}
