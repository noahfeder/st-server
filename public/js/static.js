window.onload  = function() {

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
}
