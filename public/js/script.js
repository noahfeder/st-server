window.onload  = function() {
  var inputs = document.getElementsByTagName('input');
  var button = document.getElementById('blurbutton');
  var blurred = document.querySelectorAll('#top,#firstDiv,#secondDiv,.svg-container');


  function squeeze(DOM) {
    if (DOM.middle.offsetWidth > DOM.between.offsetWidth) {
      DOM.secondDiv.classList.add('squeeze');
    } else {
      DOM.secondDiv.classList.remove('squeeze');
    }
  }
  // function firstRowLength(DOM) {
  //   return DOM.first.offsetWidth + DOM.middle.offsetWidth + DOM.last.offsetWidth;
  // }
  // function macronize(DOM) {
  //   var first = firstRowLength(DOM);
  //   var dashWidth = (first - DOM.between.offsetWidth) / 2;
  //   var macrons = Math.floor(dashWidth/31);
  //   Array.prototype.forEach.bind(DOM.dashes)(function(el){
  //     el.innerHTML = '';
  //     if (macrons < 1) {
  //       el.classList.add('hide');
  //     } else {
  //       for (var i = 0; i < macrons; i++) {
  //         el.innerHTML += '&macr;'
  //       }
  //       el.classList.remove('hide');
  //     }
  //   })
  // };

  // function underscorer(DOM) {
  //   var first = firstRowLength(DOM);
  //   var underscores = Math.floor(first/70);
  //   if (underscores < 4) {
  //     DOM.top.innerHTML = '____';
  //   } else {
  //     DOM.top.innerHTML = '';
  //     for (var i = 0; i < underscores; i++) {
  //       DOM.top.innerHTML += '_'
  //     }
  //   }
  // };

  function getDom(text) {
    return {
    'first' : document.querySelector('.first'),
    'last' : document.querySelector('.last'),
    'middle' : document.querySelector('.middle'),
    'top' : document.getElementById('top'),
    'between' : document.querySelector('.between'),
    'firstDiv' : document.getElementById('firstDiv'),
    'secondDiv' : document.getElementById('secondDiv'),
    'dashes' : document.getElementsByClassName('dash')
    };
  }

  function handleText(text,id) {
    text = text.trim();
    var len = text.length,
        DOM = getDom();
    if (id === 'first') {
      var middleText = '';
      if (len < 3) {
        DOM.first.textContent = '';
        DOM.last.textContent = '';
        DOM.middle.textContent = text;
      } else {
        for (var i = 0; i < len; i++) {
          if (i === 0) {
            DOM.first.textContent = text[i]
          } else if (i === len - 1) {
            DOM.last.textContent = text[i]
          } else {
            middleText += text[i]
          }
        }
        DOM.middle.textContent = middleText;
      }
    } else {
      DOM.between.textContent = text;
    }
    squeeze(DOM);
    // macronize(DOM);
    // underscorer(DOM);
  }

  function getValue(e) {
    if (e.keyCode !== 9 && e.keyCode !== 16) {
      var text = this.value,
            id = this.id;
      handleText(text,id);
      grab_coordinates();
    }
  }

  function reblur() {
  // using bind since a DOM collection is an array-like, not an array
    Array.prototype.forEach.bind(blurred)(function(el) {
      el.classList.remove('blurry_animate');
      window.setTimeout(function(){
        el.classList.add('blurry_animate');
      },10);
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
    var marginOffset = is_first_div_longer ? 25 : 5;

    resize_top_line(first_rect.left, first_rect.top, first_div_width);
    resize_left_line(left_line_left, (second_rect.top + marginOffset), left_line_width);
    resize_right_line((right_line_right + 6), (second_rect.top  + marginOffset), right_line_width);

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
      // left_line.setAttribute("width", width);
  }

  function resize_right_line(right, top, width){
    var right_line = document.querySelector('.right-line');
      right_line.setAttribute("x", right);
      right_line.setAttribute("y", top);
      right_line.setAttribute("width", width);
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

  listenToMe();

}
