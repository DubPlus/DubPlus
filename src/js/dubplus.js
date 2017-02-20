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

const modal = require('./utils/modal.js');
const init = require('./lib/init.js');
const css = require('./utils/css.js');

import WaitFor from './utils/waitFor.js';
import preload from './utils/preload.js';

/* globals Dubtrack */
if (!window.dubplus && Dubtrack.session.id) {

  preload();

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
  
  var _dubplusWaiting = new WaitFor(checkList, { seconds : 10}); // 10sec should be more than enough
  
  _dubplusWaiting
    .then(function(){
      init();
      $('.dubplus-waiting').remove();
    })
    .fail(function(){
       $('.dubplus-waiting span').text('Something happed, refresh and try again');
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