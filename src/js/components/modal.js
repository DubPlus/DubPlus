import { h, Component } from "preact";
// import Portal from "preact-portal/src/preact-portal";
import Portal from "@/utils/Portal.js";

/**
 * Modal used to display messages and also capture data
 *
 * @prop  {string} title       title that shows at the top of the modal
 * @prop  {string} content     A descriptive message on what the modal is for
 * @prop  {string} placeholder placeholder for the textarea
 * @prop  {function} onConfirm  runs when user clicks confirm button.
 * @prop  {function} onClose  runs when user clicks close button
 * @prop  {number} maxlength   for the textarea maxlength attribute
 */
export default class Modal extends Component {
  state = {
    error: false
  };

  keyUpHandler = e => {
    // save and close when user presses enter
    // considering removing this though
    if (e.keyCode === 13) {
      this.props.onConfirm(this.textarea.value);
      this.props.onClose();
    }
    // close modal when user hits the esc key
    if (e.keyCode === 27) {
      this.props.onClose();
    }
  };

  componentWillUnmount() {
    document.removeEventListener("keyup", this.keyUpHandler);
  }

  componentDidUpdate() {
    if (this.props.open) {
      document.addEventListener("keyup", this.keyUpHandler);
    } else {
      document.removeEventListener("keyup", this.keyUpHandler);
    }
  }

  confirmClick = () => {
    let result = this.props.onConfirm(this.textarea.value);
    if (result) {
      this.props.onClose();
    } else {
      this.setState({error: true})
    }
  };

  render(props, state) {
    let closeButtonText = !props.onConfirm ? "close" : "cancel";

    return props.open ? (
      <Portal into={document.body}>
        <div className="dp-modal">
          <aside className="container">
            <div className="title">
              <h1> {props.title || "Dub+"}</h1>
            </div>
            <div className="content">
              <p>{props.content || ""}</p>
              {state.error && <p>{props.errorMsg}</p>}
              {props.placeholder && (
                <textarea
                  ref={c => (this.textarea = c)}
                  placeholder={props.placeholder}
                  maxlength={props.maxlength || 500}
                >
                  {props.value || ""}
                </textarea>
              )}
            </div>
            <div className="dp-modal-buttons">
              <button id="dp-modal-cancel" onClick={props.onClose}>
                {closeButtonText}
              </button>
              {props.onConfirm && (
                <button id="dp-modal-confirm" onClick={this.confirmClick}>
                  okay
                </button>
              )}
            </div>
          </aside>
        </div>
      </Portal>
    ) : null;
  }
}
