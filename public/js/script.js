window.onload  = function() {
  // grabbing global static DOM vars
  var inputs = document.getElementsByTagName('input');
  var button = document.getElementById('blurbutton');
  var blurred = document.querySelectorAll('#firstDiv,#secondDiv,.svg-container');
  var timer = 0;
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
  /*
  * take text from inputs OR url and add to DOM
  */
  function handleText(text,id) {
    text = text.trim(); // strip whitespace
    var len = text.length,
        DOM = getDom();
    if (id === 'first') { // firstDiv text, top row
      if (len < 3) { // for 0, 1, or 2 character strings, don't capitalize
        DOM.first.textContent = '';
        DOM.last.textContent = '';
        DOM.middle.textContent = text;
      } else { // loop over text string
        var middleText = '';
        for (var i = 0; i < len; i++) {
          if (i === 0) { //first char
            DOM.first.textContent = text[i]
          } else if (i === len - 1) { //last char
            DOM.last.textContent = text[i]
          } else { //other chars
            middleText += text[i]
          }
        }
        //DOM.middle.textContent = middleText;
        spanifyText(middleText, DOM.middle);
      }
    } else { // secondDiv text, bottom row
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
      grab_coordinates();
      applyAnimations();
    }
  }

  function spanifyText(text, row){
    var splitText = text.split('');
    var textLength = text.length;

    row.textContent=('');
    for (var i = 0; i < textLength; i++)
    {
      var letterSpan = document.createElement('span');
      letterSpan.classList.add('minor_letter');
      letterSpan.textContent = splitText[i];
      row.appendChild(letterSpan);
    }
  }

  /*
  * Re-blur the text, if you wanna
  */
  function reblur() {
  // using bind since a DOM collection is an array-like, not an array
    Array.prototype.forEach.bind(blurred)(function(el) {

    });
  }

  function grab_coordinates(){
    //###
    //Grab coordinates of text div boxes
    //###
    var first_div = document.querySelector('#firstDiv');
    var second_div = document.querySelector('#secondDiv');
    var first_rect = first_div.getBoundingClientRect();
    var second_rect = second_div.getBoundingClientRect();
    var first_div_width = (first_rect.right - first_rect.left)
    var second_div_width = (second_rect.right - second_rect.left)
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
    var marginOffset = is_first_div_longer ? -30: -45;

    resize_top_line(first_rect.left, first_rect.top, first_div_width);
    resize_left_line(left_line_left, (first_rect.bottom + marginOffset), left_line_width);
    resize_right_line((right_line_right + 6), (first_rect.bottom  + marginOffset), right_line_width);

  }

  function resize_top_line(left, top, width){
    var top_line = document.querySelector('.top-line');
      top_line.setAttribute("x", left);
      top_line.setAttribute("y", top);
      top_line.setAttribute("width", width);
  }

  function resize_left_line(left, top, width){
    var left_line = document.querySelector('.left-line');
      left_line.setAttribute("x", left);
      left_line.setAttribute("y", top);
      left_line.setAttribute("width", width);
  }

  function resize_right_line(right, top, width){
    var right_line = document.querySelector('.right-line');
      right_line.setAttribute("x", right);
      right_line.setAttribute("y", top);
      right_line.setAttribute("width", width);
  }

  function applyAnimations(){
    window.clearTimeout(timer);
    var firstLetter = document.querySelector(".first");
    var lastLetter = document.querySelector(".last");
    var minorLetters = document.getElementsByClassName('minor_letter');
    var animations = ['enter-top','enter-bottom','enter-left','enter-right'];
    var randomAnimation;
    var chosenAnimation; //To make sure previous animation is not chosen twice.

    firstLetter.style.position = 'relative';
    lastLetter.style.position = 'relative';
    firstLetter.classList.remove('enter-left');
    lastLetter.classList.remove('enter-right');
    Array.prototype.forEach.bind(minorLetters)(function(letter) {
      letter.style.position = 'relative';
      letter.className = "minor_letter";
    });
    window.setTimeout(function(){
      firstLetter.classList.add('enter-left');
      lastLetter.classList.add('enter-right');
      Array.prototype.forEach.bind(minorLetters)(function(letter) {
        //###
        //Random non-repeating animation assignment
        //###
        while (chosenAnimation === randomAnimation)
        {
          randomAnimation = Math.floor(Math.random() * animations.length);
        }
        chosenAnimation = randomAnimation;
        letter.classList.add(animations[randomAnimation]);
        console.log(animations[randomAnimation])
    });
    },10);

    timer = window.setTimeout(function() {
      firstLetter.style.position = 'static';
      lastLetter.style.position = 'static';
      Array.prototype.forEach.bind(minorLetters)(function(letter) {
      letter.style.position = 'static';
    });
    },2010)
  }

  function listenToMe() {
    inputs[0].addEventListener('keyup',getValue)
    inputs[1].addEventListener('keyup',getValue)
    button.addEventListener('click',reblur)
    if (inputs[0].value !== "STRANGER") {
      handleText(inputs[0].value,inputs[0].id)
      handleText(inputs[1].value,inputs[1].id)
    }
    window.onresize = grab_coordinates;
    grab_coordinates();
  }

  spanifyText('trange', document.querySelector('.middle')); //In lieu of spanning them in HTML template
  spanifyText('things', document.querySelector('.between')); //In lieu of spanning them in HTML template
  listenToMe();
  applyAnimations()

}
