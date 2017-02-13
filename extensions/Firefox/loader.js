$('body').prepend('<div class="cake" style=" z-index: 2147483647; color: white; position: fixed; top: 69px; right: 13px; background: #222; padding: 13px; -webkit-box-shadow: 0px 0px 5px 0px rgba(0,0,0,0.75); -moz-box-shadow: 0px 0px 5px 0px rgba(0,0,0,0.75); box-shadow: 0px 0px 5px 0px rgba(0,0,0,0.75); border-radius: 5px;">Waiting for Dubtrack...</div>');
setTimeout(function(){
    $.getScript('https://rawgit.com/DubPlus/DubPlus/master/dubplus.js');
    $('.cake').remove();
}, 5000);
