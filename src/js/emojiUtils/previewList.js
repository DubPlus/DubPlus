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

var textChoice = "";
var currentData;

var setData = function(data) {
  currentData = data;
};

function repl(str, start, end, newtext) {
  return str.substring(0, start-1) + newtext + str.substring(end);
}

var updateChatInput = function(start, end, newText){
  var inputText = $("#chat-txt-message").val();
  var updatedText = repl(inputText, start, end, newText || textChoice) + " ";
  $('#autocomplete-preview').empty().removeClass('ac-show');
  $("#chat-txt-message").val(updatedText).focus();
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
  var $pvItem = $('.preview-item.selected');
  $pvItem.get(0).scrollIntoView(false);
  textChoice = $pvItem.find('.ac-text').text();
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
    function makeEnterSpan() {
      var s = document.createElement('span');
      s.textContent = 'press enter to select';
      s.className = "ac-list-press-enter"; // autocomplete text
      return s;
    }

    function makeLi (info, i){
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
        
        if (i === 0) {
          container.appendChild(makeEnterSpan());
          container.classList.add('selected');
        }
        container.tabIndex = -1;
        return container;
    }

    var aCp =  document.getElementById('autocomplete-preview');
    aCp.innerHTML = "";
    var frag = document.createDocumentFragment();

    acArray.forEach(function(val, i){
      frag.appendChild(makeLi(val, i));
    });

    aCp.appendChild(frag);
    aCp.classList.add('ac-show');
};

var updater = function(){
  var newText = $(this).find('.ac-text').text();
  updateChatInput(currentData.strStart, currentData.strEnd, newText);
};

var init = function(){
  var acUL = document.createElement('ul');
  acUL.id = "autocomplete-preview";
  $('.pusher-chat-widget-input').prepend(acUL);
  $(document.body).on('click', '.preview-item', updater);
};


var stop = function(){
  $(document.body).off('click', '.preview-item', updater);
  $('#autocomplete-preview').remove();
};

module.exports = {
  init: init,
  stop : stop,
  display: display,
  updateChatInput: updateChatInput,
  doNavigate : doNavigate,
  setData : setData
};