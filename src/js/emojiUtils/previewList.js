/**
 * previewList
 * 
 * In this JS file should only exist what's necessary to populate the
 * autocomplete preview list that popups up for emojis and mentions
 * 
 * It also binds the events that handle navigating through the list
 * and also placing selected text into the chat
 */

// var css = require('../utils/css.js');

var updateChatInput = function(str){
  var inputText = $("#chat-txt-message").val();
  var updatedText = inputText.split(' ').map(function(c,i,r){
      var fullStr = str.toLowerCase();
      var partialStr = c.toLowerCase();
      if (fullStr.indexOf(partialStr) === 0) { 
          return str;
      } else {
          return c;
      }
  });
  $('#autocomplete-preview').empty().removeClass('ac-show');
  $("#chat-txt-message").val(updatedText.join(' ') + ' ').focus();
};

var doNavigate = function(diff) {
  var displayBoxIndex = $('.preview-item.selected').index();
  
  displayBoxIndex += diff;
  var oBoxCollection = $(".ac-show li");
  
  // remove "press enter to select" span
  $('.ac-list-press-enter').remove();

  if (displayBoxIndex >= oBoxCollection.length){
    displayBoxIndex = 0;
  }
  if (displayBoxIndex < 0){
    displayBoxIndex = oBoxCollection.length - 1;
  }
  
  var cssClass = "selected";
  var enterToSelectSpan = '<span class="ac-list-press-enter">press enter to select</span>';
  oBoxCollection.removeClass(cssClass).eq(displayBoxIndex).addClass(cssClass).append(enterToSelectSpan);
  $('.preview-item.selected').get(0).scrollIntoView(false);
};

var previewListKeyUp = function(e){
  e.preventDefault();
  switch(e.keyCode) {
      case 38:
          doNavigate(-1);
          break;
      case 40:
          doNavigate(1);
          break;
      case 39:
      case 13:
          var new_text = $('#autocomplete-preview li.selected').find('.ac-text')[0].textContent;
          updateChatInput(new_text);
          break;
      default:
          $("#chat-txt-message").focus();
          break;
  }
};

/**
 * Populates the popup container with a list of items that you can click/enter
 * on to autocomplete items in the chat box
 * @param  {Array} acArray  the array of items to be added.  Each item is an object:
 * {
 *   src : full image src,
 *   text : text for auto completion,
 *   cn : css class name for to be concat with '-preview',
 *   alt : OPTIONAL, to add to alt and title tag
 * }
 */
var display = function(acArray) {
    function makePreviewContainer(cn){
        var d = document.createElement('li');
        d.className = cn;
        return d;
    }
    function makeImg(src, altText) {
        var i = document.createElement('img');
        i.src = src;
        if (altText) {
            i.title = altText;
            i.alt = altText;
        }
        var div = document.createElement('div');
        div.className = "ac-image";
        div.appendChild(i);
        return div;
    }
    function makeNameSpan (name){
        var s = document.createElement('span');
        s.textContent = name;
        s.className = "ac-text"; // autocomplete text
        return s;
    }
    function makeLi (info){
        var container = makePreviewContainer("preview-item "+info.cn+"-previews");
        var span = makeNameSpan(info.text);
        var img;
        if (info.alt) {
            img = makeImg(info.src, info.alt);
        } else {
            img = makeImg(info.src);
        }
        container.appendChild(img);
        container.appendChild(span);
        container.tabIndex = -1;
        return container;
    }

    var aCp =  document.getElementById('autocomplete-preview');
    aCp.innerHTML = "";
    var frag = document.createDocumentFragment();

    acArray.forEach(function(val){
      frag.appendChild(makeLi(val));
    });

    aCp.appendChild(frag);
    aCp.classList.add('ac-show');
};

var updater = function(e) {
  var new_text = $(this).find('.ac-text')[0].textContent;
  updateChatInput(new_text);
};

var init = function(){
  var acUL = document.createElement('ul');
  acUL.id = "autocomplete-preview";
  $('.pusher-chat-widget-input').prepend(acUL);

  $(document.body).on('click', '.preview-item', updater);
  $(document.body).on('keyup', '.ac-show', previewListKeyUp);
};


var stop = function(){
  $(document.body).off('click', '.preview-item', updater);
  $(document.body).off('keyup', '.ac-show', previewListKeyUp);
  $('#autocomplete-preview').remove();
};

module.exports = {
  init: init,
  stop : stop,
  display: display,
  updateChatInput: updateChatInput,
  doNavigate : doNavigate
};