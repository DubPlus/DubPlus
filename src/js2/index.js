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

import { h, render, Component } from 'preact';
import DubPlusMenu from './menu/index.js';
import Modal from './components/modal.js';
import WaitFor from './utils/waitFor.js';
import Loading from './components/loading.js';
import cssHelper from './utils/css.js';

setTimeout(function(){
  // start the loading of the CSS asynchronously
  cssHelper.load('/css/dubplus.css');
},1);

class DubPlusContainer extends Component {
  constructor() {
    super();
    this.state = {
      loading: true,
      error: false,
      errorMsg : ''
    }
  }
  
  componentDidMount(){
    /* globals Dubtrack */
    if (!window.DubPlus) {

      // checking to see if these items exist before initializing the script
      // instead of just picking an arbitrary setTimeout and hoping for the best
      var checkList = [
        'Dubtrack.session.id',
        'Dubtrack.room.chat',
        'Dubtrack.Events',
        'Dubtrack.room.player',
        'Dubtrack.helpers.cookie',
        'Dubtrack.room.model',
        'Dubtrack.room.users',
      ];
      
      var _dubplusWaiting = new WaitFor(checkList, { seconds : 10}); // 10sec should be more than enough
      
      _dubplusWaiting
        .then(()=>{
          this.setState({
            loading: false, 
            error: false
          })
        })
        .fail(()=>{
          if (!Dubtrack.session.id) {
            this.showError('You\'re not logged in. Please login to use Dub+.');
          } else {
            this.showError('Something happed, refresh and try again');
          }
        });

    } else {
      if (!Dubtrack.session.id) {
        this.showError('You\'re not logged in. Please login to use Dub+.');
      } else {
        this.showError('Dub+ is already loaded');
      }
    }
  }

  showError(msg) {
    this.setState({
      loading: false, 
      error: true,
      errorMsg: msg
    });
  }

  render(props,state) {

    if (state.loading && !state.error) {
      return <Loading />
    }

    if (state.error && !state.loading) {
      return <Modal title="Dub+ Error" show={true} content={state.errorMsg}/>
    }

    if (!state.error && !state.loading) {
      return <DubPlusMenu />
    }

  }
}

render(<DubPlusContainer />, document.body);

// _PKGINFO_ is inserted by rollup JS
export default _PKGINFO_;