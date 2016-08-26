"use strict";
window.onload  = function() {
  //browser detection! from http://stackoverflow.com/questions/9847580/how-to-detect-safari-chrome-ie-firefox-and-opera-browser
  var isOpera = (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;
  var isFirefox = (typeof InstallTrigger !== 'undefined');
  var isSafari = Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0;
  var isIE = /*@cc_on!@*/false || !!document.documentMode;
  var isEdge = !isIE && !!window.StyleMedia;
  var isChrome = !!window.chrome && !!window.chrome.webstore;
  var isBlink = (isChrome || isOpera) && !!window.CSS;

  // grabbing global static DOM vars
  var inputs = document.getElementsByTagName('input');
  var button = document.getElementById('blurbutton');
  var download = document.getElementById('downloadlink');
  var body = document.body;
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
      text = 'X';
    } else {
      DOM.between.classList.remove('invisible');
    }
    return text;
  }
  /*
  * Turn text into individual spans so we can slide 'em around
  */
  function spanifyText(text, row){
    var splitText = text.split('');
    var textLength = text.length;
    row.textContent = '';
    var i = 0;
    var letterSpan = null;
    for (i = 0; i < textLength; i++) {
      letterSpan = document.createElement('span');
      letterSpan.classList.add('minor_letter');
      letterSpan.textContent = splitText[i];
      row.appendChild(letterSpan);
    }
  }

  /*
  * take text from inputs OR url and add to DOM
  */
  function handleText(text,id) {
    text = text.trim(); // strip whitespace
    var len = text.length;
    var DOM = getDom();
    var middleText = '';
    if (id === 'first') { // firstDiv text, top row
      if (len < 3) { // for 0, 1, or 2 character strings, don't capitalize
        DOM.first.textContent = '';
        DOM.last.textContent = '';
        middleText = text;
        DOM.middle.classList.add('lonely');
      } else { // loop over text string
        DOM.middle.classList.remove('lonely');
        var i = 0;
        for (i = 0; i < len; i++) {
          if (i === 0) { //first char
            DOM.first.textContent = text[i];
          } else if (i === len - 1) { //last char
            DOM.last.textContent = text[i];
          } else { //other chars
            middleText += text[i];
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

  // Resize SVG lines on the fly
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
        window.setTimeout(function(){
          while (chosenAnimation === randomAnimation) {
            randomAnimation = Math.floor(Math.random() * animations.length);
          }
          chosenAnimation = randomAnimation;

          letter.classList.add(animations[randomAnimation]);
          letter.style.opacity = '1';//Make visible when animations start
        },randomStartTime);
    });
    },10);

    letterTimer = window.setTimeout(function() {
      firstLetter.style.position = 'static';
      lastLetter.style.position = 'static';
      Array.prototype.forEach.bind(minorLetters)(function(letter) {
      letter.style.position = 'static';
      window.setTimeout(function(){
        topLine.classList.add('flash-line');
        topLine.style.display = "initial";
      },750);
      window.setTimeout(function(){
        right_line.classList.add('flash-line');
        left_line.classList.add('flash-line');
        left_line.style.display = "initial";
        right_line.style.display = "initial";
      },750);
    });
    },overallAnimationTime);
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
      }, 10, el);
    });
  }

  function moveUp() {
    body.classList.add('moveup');
  }

  function moveDown(e) {
    if (e.relatedTarget.localName === 'button') {
      e.relatedTarget.click()
    }
    body.classList.remove('moveup');
  }
  // load in img src on modal
  function loadImg() {
    var img = document.querySelector('.modal img');
    img.src = 'https://st-text.herokuapp.com/' + inputs[0].value.toLowerCase() + '/' + inputs[1].value.toLowerCase() + '/print';
  }

  function downloader() {
    if (isChrome) {
      var link = document.getElementById('downloadlink');
      link.setAttribute('download', inputs[0].value.toLowerCase() + '-' + inputs[1].value.toLowerCase() + '.png');
      link.setAttribute('href', 'https://st-text.herokuapp.com/' + inputs[0].value.toLowerCase() + '/' + inputs[1].value.toLowerCase() + '/print');
    } else {
      loadImg();
      body.classList.add('show');
    }
  }

  function hideModal(e) {
    if (body.classList[0] === 'show' && e.target.id !== "downloadbutton") {
      body.classList.remove('show');
    }
  }

  function listenToMe() {
    button.addEventListener('click',function(){
      handleText(inputs[0].value,inputs[0].id);
      handleText(inputs[1].value,inputs[1].id);
      reAnimate();
    });

    inputs[1].addEventListener('keyup',function(e) {
      if (e.keyCode === 13) {
        moveDown();
        handleText(inputs[0].value,inputs[0].id);
        handleText(inputs[1].value,inputs[1].id);
        grabCoordinates();
        applyAnimations();
      }
    });

    if (inputs[0].value !== "STRANGER" || inputs[1].value !== "THINGS") {
      handleText(inputs[0].value,inputs[0].id);
      handleText(inputs[1].value,inputs[1].id);
    } else {
      spanifyText('trange', document.querySelector('.middle')); //In lieu of spanning them in HTML template
      spanifyText('things', document.querySelector('.between')); //In lieu of spanning them in HTML template
    }

    window.onresize = grabCoordinates;

    download.addEventListener('click',downloader);

    Array.prototype.forEach.bind(inputs)(function(el){
      el.addEventListener('focus',moveUp);
      el.addEventListener('blur',moveDown);
    });

    var page = document.querySelector('.words-container');
    page.addEventListener('click',hideModal)
  } //end listenToMe function

  if (isIE || isEdge) {
    window.location.replace("https://www.google.com/chrome/");
  } else {
    listenToMe();
    grabCoordinates();
    applyAnimations();
  }

  function resizer() {
    var resize = new CustomEvent('resize');
    window.dispatchEvent(resize);
  }

  if (!Modernizr.adownload) {
    window.setTimeout(resizer,2500);
  } // end safari SVG weirdness block

}; // end onload block
