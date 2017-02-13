/**
 * input is a modal used to display messages and also capture data
 * 
 * @param  {String} title       title that shows at the top of the modal
 * @param  {String} content     A descriptive message on what the modal is for
 * @param  {String} placeholder placeholder for the textarea
 * @param  {String} confirm     a way to customize the text of the confirm button
 * @param  {Number} maxlength   for the textarea maxlength attribute
 */
var create = function(infoObj) {
    var defaults = {
        title: '',
        content: '',
        placeholder: null,
        confirmButtonClass: null,
        maxlength: null,
        confirmCallback: null
    };
    var opts = $.extend(true, {}, this.defaults, infoObj);
    
    var textarea = '';
    var confirmButton = '';

    if (opts.placeholder) {
        var mx = opts.maxlength || 999;
        textarea = '<textarea class="input" type="text" placeholder="'+opts.placeholder+'" maxlength="'+ mx +'">'+opts.content+'</textarea>';
    }
    if (opts.confirmButtonClass) {
        confirmButton = '<div class="'+opts.confirmButtonClass+' confirm"><p>Okay</p></div>';
    }
    
    var dubplusModal = [
        '<div class="onErr">',
            '<div class="container">',
                '<div class="title">',
                    '<h1>'+opts.title+'</h1>',
                '</div>',
                '<div class="content">',
                    '<p>'+opts.content+'</p>',
                    textarea,
                '</div>',
                '<div class="control">',
                    '<div class="cancel dubplus-js-cancel">',
                        '<p>Cancel</p>',
                    '</div>',
                    confirmButton,
                '</div>',
            '</div>',
        '</div>'
    ].join('');
    $('body').append(dubplusModal);

    // add one time cancel click
    $('.dubplus-js-cancel').one("click",function(){
        $('.onErr').remove();
    });
    
    if (opts.confirmButtonClass) {
      $('.'+opts.confirmButtonClass).one("click", function(e){
        if (typeof opts.confirmCallback === 'function'){
            opts.confirmCallback();
        }
        $('.onErr').remove();
      });
    }
    
};

var close = function() {
    $('.onErr').remove();
};

module.exports = {
    create: create,
    close : close
};