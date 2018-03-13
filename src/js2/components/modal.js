'use strict';
import { h, Component } from 'preact';

/**
 * input is a modal used to display messages and also capture data
 * 
 * @prop  {string} title       title that shows at the top of the modal
 * @prop  {string} content     A descriptive message on what the modal is for
 * @prop  {string} placeholder placeholder for the textarea
 * @prop  {function} onConfirm  runs when user clicks confirm button
 * @prop  {number} maxlength   for the textarea maxlength attribute
 * @prop  {boolean} show  whether to show the modal or not
 */
export default class Modal extends Component {
  constructor(){
    super();
    this.state = {
      show : this.props.show || false
    }
    this.confirmClick = this.confirmClick.bind(this);
    this.removeSelf = this.removeSelf.bind(this);
    this.keyUpHandler = this.keyUpHandler.bind(this);
  }

  keyUpHandler(e) {
    // enter
    if (e.keyCode === 13 && typeof this.props.onConfirm === 'function') { 
      this.props.onConfirm();
      this.removeSelf();
    }
    // esc
    if (e.keyCode === 27) { 
      this.removeSelf();
    }
  }

  componentWillUnmount() {
    // unbind, even though I doubt we'll ever need to
    document.removeEventListener('keyup', this.keyUpHandler);
  }

  componentWillReceiveProps(nextProps){
    if (nextProps.show) {
      document.addEventListener('keyup', this.keyUpHandler);
      this.setState({show: true});
    }
  }

  removeSelf(){
    // hide component
    this.setState({show: false});
    document.removeEventListener('keyup', this.keyUpHandler);
  }

  confirmClick(){
    if (typeof this.props.onConfirm === 'function') {
      this.props.onConfirm();
    }
    this.removeSelf();
  }

  render(props,state) {
    return (
      <div className={'dp-modal' + (this.state.show ? ' dp-modal-show' : '' )}>
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
            {props.onConfirm &&
              <div className="dp-modal-buttons">
                <button id="dp-modal-cancel" onClick={this.removeSelf}>cancel</button>
                <button id="dp-modal-confirm" onClick={this.confirmClick}>okay</button>
              </div>
            }
            {!props.onConfirm &&
              <div className="dp-modal-buttons">
                <button id="dp-modal-cancel" onClick={this.removeSelf}>close</button>
              </div>
            }
        </aside>
      </div>
    );
  }
}