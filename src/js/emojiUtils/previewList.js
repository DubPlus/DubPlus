var debugAC = false;
function log(){
  if (debugAC) { console.log.apply(console, arguments); }
}

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
var makeList = function(acArray) {
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

function isElementInView (el, container) {
  var rect = el.getBoundingClientRect();
  var outerRect = container.getBoundingClientRect();
  return rect.top >= outerRect.top && rect.bottom <= outerRect.bottom;
}

/**
 * previewList
 * 
 * In this JS file should only exist what's necessary to populate the
 * autocomplete preview list that popups up for emojis and mentions
 * 
 * It also binds the events that handle navigating through the list
 * and also placing selected text into the chat
 */
class PreviewListManager {
  constructor(data) {
    this._data = data || {
      start : 0,
      end : 0,
      selected : ""
    };
  }

  get data() {
    return this._data;
  }

  set data(newData) {
    if (newData) { this._data = newData; }
  }

  set selected(text) {
    if (text) {this._data.selected = text; }
  }

  repl(str, start, end, newtext) {
    return str.substring(0, start-1) + newtext + str.substring(end);
  }

  updateChatInput() {
    log("inUpdate",this._data);
    var inputText = $("#chat-txt-message").val();
    var updatedText = this.repl(inputText, this._data.start, this._data.end, this._data.selected) + " ";
    $('#autocomplete-preview').empty().removeClass('ac-show');
    $("#chat-txt-message").val(updatedText).focus();
  }

  doNavigate(diff) {
    // get the current index of selected element within the nodelist collection of previews
    var displayBoxIndex = $('.preview-item.selected').index();
    
    // calculate new index position with given argument
    displayBoxIndex += diff;

    var oBoxCollection = $(".ac-show li");
    
    // remove "press enter to select" span
    $('.ac-list-press-enter').remove();

    // if new index is greater than total length then we reset back to the top
    if (displayBoxIndex >= oBoxCollection.length){
      displayBoxIndex = 0;
    }
    // if at the top and index becomes negative, we wrap down to end of array
    if (displayBoxIndex < 0){
      displayBoxIndex = oBoxCollection.length - 1;
    }
    
    var cssClass = "selected";
    var enterToSelectSpan = '<span class="ac-list-press-enter">press enter or tab to select</span>';
    oBoxCollection.removeClass(cssClass).eq(displayBoxIndex).addClass(cssClass).append(enterToSelectSpan);
    
    var pvItem = document.querySelector('.preview-item.selected');
    var acPreview = document.querySelector('#autocomplete-preview');
    var isInView = isElementInView(pvItem, acPreview);
    log("isInView", isInView);
    var align = diff === 1 ? false : true;
    if (!isInView) {
      pvItem.scrollIntoView(align);
    }
  }

  updater(e){
    log(e.target, e);
    this._data.selected = $(e.target).find('.ac-text').text();
    this.updateChatInput();
  }

  init () {
    var acUL = document.createElement('ul');
    acUL.id = "autocomplete-preview";
    $('.pusher-chat-widget-input').prepend(acUL);
    $(document.body).on('click', '.preview-item', (e)=>this.updater(e));
  }

  stop (){
    // the garbade collector should clean up the event listener added in init
    $('#autocomplete-preview').remove();
  }
}

export {PreviewListManager, makeList};