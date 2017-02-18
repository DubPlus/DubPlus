'use strict';

function makeButtons(cb){
  var buttons = '';
  if (cb) {
    buttons += '<button id="dp-modal-cancel">cancel</button>';
    buttons += '<button id="dp-modal-confirm">okay</button>';
  } else {
    buttons += '<button id="dp-modal-cancel">close</button>';
  }
  return buttons;
}

/**
 * input is a modal used to display messages and also capture data
 * 
 * @param  {String} title       title that shows at the top of the modal
 * @param  {String} content     A descriptive message on what the modal is for
 * @param  {String} placeholder placeholder for the textarea
 * @param  {String} confirm     a way to customize the text of the confirm button
 * @param  {Number} maxlength   for the textarea maxlength attribute
 */
var create = function(options) {
  var defaults = {
      title: 'Dub+',
      content: '',
      value : '',
      placeholder: null,
      maxlength: 999,
      confirmCallback: null
  };
  var opts = $.extend({}, defaults, options);
  
  /*****************************************************
   * Create modal html string
   */
  
  // textarea in our modals are optional.  To add one, using the placeholder option will generate
  // a textarea in the modal
  var textarea = '';
  if (opts.placeholder) {
    textarea = '<textarea placeholder="'+opts.placeholder+'" maxlength="'+ opts.maxlength +'">';
    textarea += opts.value;
    textarea += '</textarea>';
  }

  var dubplusModal = [
    '<div class="dp-modal">',
      '<aside class="container">',
        '<div class="title">',
          '<h1>'+opts.title+'</h1>',
        '</div>',
        '<div class="content">',
          '<p>'+opts.content+'</p>',
          textarea,
        '</div>',
        '<div class="dp-modal-buttons">',
          makeButtons(opts.confirmCallback),
        '</div>',
      '</aside>',
    '</div>',
  ].join('');

  $('body').append(dubplusModal);

  /*****************************************************
   * Attach events to your modal
   */

  // if a confirm cb function was defined then we add a click event to the 
  // confirm button as well
  if (typeof opts.confirmCallback === 'function'){
    $('#dp-modal-confirm').one("click", function(e){
      opts.confirmCallback();
      $('.dp-modal').remove();
    });
  }

  // add one time cancel click
  $('#dp-modal-cancel').one("click",function(){
    $('.dp-modal').remove();
  });

  // bind one time keyup ENTER and ESC events
  $(document).one('keyup', function(e) {
    // enter
    if (e.keyCode === 13 && typeof opts.confirmCallback === 'function') { 
      opts.confirmCallback();
      $('.dp-modal').remove();
    }
    // esc
    if (e.keyCode === 27) { 
      $('.dp-modal').remove();
    }
  });

};

var close = function() {
  $('.dp-modal').remove();
};

module.exports = {
  create: create,
  close : close
};