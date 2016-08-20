window.onload  = function() {
  var inputs = document.getElementsByTagName('input');
  var button = document.getElementById('blurbutton');
  var blurred = document.querySelectorAll('#top,#firstDiv,#secondDiv');

  function squeeze(DOM) {
    if (DOM.middle.offsetWidth > DOM.between.offsetWidth) {
      DOM.secondDiv.classList.add('squeeze');
    } else {
      DOM.secondDiv.classList.remove('squeeze');
    }
  }

  function macronize(DOM) {
    var first = DOM.first.offsetWidth + DOM.middle.offsetWidth + DOM.last.offsetWidth;
    var dashWidth = (first - DOM.between.offsetWidth) / 2;
    console.log(dashWidth);
    var macrons = Math.floor(dashWidth/31);
    Array.prototype.forEach.bind(DOM.dashes)(function(el){
      el.innerHTML = '';
      if (macrons < 1) {
        el.classList.add('hide');
      } else {
        for (var i = 0; i < macrons; i++) {
          el.innerHTML += '&macr;'
        }
        el.classList.remove('hide');
      }
    })
  }

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
      DOM.top.textContent = '';
      var middleText = '';
      if (len < 3) {
        DOM.first.textContent = '';
        DOM.last.textContent = '';
        DOM.middle.textContent = text;
        DOM.top.textContent = '____'
      } else {
        for (var i = 0; i <= len; i++) {
          DOM.top.textContent += '_';
        }
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
    macronize(DOM);
  }

  function getValue(e) {
    if (e.keyCode !== 9 && e.keyCode !== 16) {
      var text = this.value,
            id = this.id;
      handleText(text,id)
    }
  }

  function reblur() {
  // using bind since a DOM collection is an array-like, not an array
    Array.prototype.forEach.bind(blurred)(function(el) {
      el.classList.remove('blurry');
      window.setTimeout(function(){
        el.classList.add('blurry');
      },10);
    });
  }
  function listenToMe() {
    inputs[0].addEventListener('keyup',getValue)
    inputs[1].addEventListener('keyup',getValue)
    button.addEventListener('click',reblur)
    if (inputs[0].value !== "STRANGER") {
      handleText(inputs[0].value,inputs[0].id)
      handleText(inputs[1].value,inputs[1].id)
    }
  }

  listenToMe();

}
