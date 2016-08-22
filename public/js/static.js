window.onload  = function() {
  // polyfill from https://github.com/tom-james-watson/phantomjs-polyfill
  if (typeof Function.prototype.bind != 'function') {
      Function.prototype.bind = function bind(obj) {
          var args = Array.prototype.slice.call(arguments, 1),
              self = this,
              nop = function() {
              },
              bound = function() {
                  return self.apply(
                      this instanceof nop ? this : (obj || {}), args.concat(
                          Array.prototype.slice.call(arguments)
                      )
                  );
              };
          nop.prototype = this.prototype || {};
          bound.prototype = new nop();
          return bound;
      };
  }

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
    line.style.left = left + 'px';
    line.style.top = top + 'px';
    // short lines look weird on the sides, thus:
    if (name !== 'top') {
      width = (width < 20) ? 0 : width;
    }
    line.style.width = width + 'px';
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

  spanifyText('trange', document.querySelector('.middle')); //In lieu of spanning them in HTML template
  spanifyText('things', document.querySelector('.between')); //In lieu of spanning them in HTML template
  handleText(inputs[0].value,inputs[0].id)
  handleText(inputs[1].value,inputs[1].id)
  // grabCoordinates();
}
