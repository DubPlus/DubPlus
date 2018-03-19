'use strict';
import { h, Component } from 'preact';

/**
 * input is a modal used to display messages and also capture data
 * 
 * @prop  {string} title       title that shows at the top of the modal
 * @prop  {string} content     A descriptive message on what the modal is for
 * @prop  {string} placeholder placeholder for the textarea
 * @prop  {function} onConfirm  runs when user clicks confirm button.
 * @prop  {function} onClose  runs when user clicks close button
 * @prop  {number} maxlength   for the textarea maxlength attribute
 */
export default class Modal extends Component {
  constructor(props){
    super(props);
    this.confirmClick = this.confirmClick.bind(this);
    this.removeSelf = this.removeSelf.bind(this);
    this.keyUpHandler = this.keyUpHandler.bind(this);
  }

  keyUpHandler(e) {
    // save and close when user presses enter
    // considering removing this though
    if (e.keyCode === 13 && typeof this.props.onConfirm === 'function') { 
      this.props.onConfirm();
      this.removeSelf();
    }
    // close modal when user hits the esc key
    if (e.keyCode === 27) { 
      this.removeSelf();
    }
  }

  componentWillMount(){
    document.addEventListener('keyup', this.keyUpHandler);
  }

  componentWillUnmount() {
    // unbind, even though I doubt we'll ever need to
    document.removeEventListener('keyup', this.keyUpHandler);
  }

  removeSelf(){
    
  }

  confirmClick(){
    if (typeof this.props.onConfirm === 'function') {
      this.props.onConfirm();
    }
    this.removeSelf();
  }

  render(props,state) {
    let closeButtonText = !props.onConfirm ? 'close' : 'cancel';

    return (
      <div className='dp-modal'>
        <aside className="container">
          <div className="title">
            <h1> { props.title || 'Dub+' }</h1>
          </div>
          <div className="content">
            <p>{props.content || ''}</p>
            {props.placeholder &&
              <textarea placeholder={props.placeholder} maxlength={props.maxlength || 999}>
                {props.value || ''}
              </textarea>
            }
          </div>
          <div className="dp-modal-buttons">
            <button id="dp-modal-cancel" onClick={this.removeSelf}>{closeButtonText}</button>
            {props.onConfirm &&
              <button id="dp-modal-confirm" onClick={this.confirmClick}>okay</button>
            }
          </div>
        </aside>
      </div>
    );
  }
}