/*
     /$$$$$$$            /$$                
    | $$__  $$          | $$          /$$   
    | $$  \ $$ /$$   /$$| $$$$$$$    | $$   
    | $$  | $$| $$  | $$| $$__  $$ /$$$$$$$$
    | $$  | $$| $$  | $$| $$  \ $$|__  $$__/
    | $$  | $$| $$  | $$| $$  | $$   | $$   
    | $$$$$$$/|  $$$$$$/| $$$$$$$/   |__/   
    |_______/  \______/ |_______/           
                                            
                                            
    https://github.com/DubPlus/DubPlus

    MIT License 

    Copyright (c) 2017 DubPlus

    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to deal
    in the Software without restriction, including without limitation the rights
    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in all
    copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
    SOFTWARE.
*/

var modal = require('./utils/modal.js');
var init = require('./lib/init.js');
var css = require('./utils/css.js');

import WaitFor from './utils/waitFor.js';

/* globals Dubtrack */
if (!window.dubplus && Dubtrack.session.id) {

  $('body').prepend('<div class="dubplus-waiting" style="font-family: \'Trebuchet MS\', Helvetica, sans-serif; z-index: 2147483647; color: white; position: fixed; top: 69px; right: 13px; background: #222; padding: 13px; -webkit-box-shadow: 0px 0px 5px 0px rgba(0,0,0,0.75); -moz-box-shadow: 0px 0px 5px 0px rgba(0,0,0,0.75); box-shadow: 0px 0px 5px 0px rgba(0,0,0,0.75); border-radius: 5px;">Waiting for Dubtrack...</div>');
  
  // checking to see if these items exist before initializing the script
  // instead of just picking an arbitrary setTimeout and hoping for the best
  var checkList = [
    'Dubtrack.room.chat',
    'Dubtrack.Events',
    'Dubtrack.room.player',
    'Dubtrack.helpers.cookie',
    'Dubtrack.room.model',
    'Dubtrack.room.users',
  ];
  var _dubplusWaiting = new WaitFor(checkList, { seconds : 10}); // 10 sec might be too long
  _dubplusWaiting
    .then(function(){
      init();
      $('.dubplus-waiting').remove();
    })
    .fail(function(){
       $('.dubplus-waiting').text('Something happed, refresh and try again').delay(3000).remove();
    });

} else {
  var errorMsg;
  if (!Dubtrack.session.id) {
    css.load('/css/dubplus.css');
    errorMsg = 'You\'re not logged in. Please login to use Dub+.';
  } else {
      errorMsg = 'Dub+ is already loaded';
  }
  modal.create({
    title: 'Dub+ Error',
    content: errorMsg
  });
}