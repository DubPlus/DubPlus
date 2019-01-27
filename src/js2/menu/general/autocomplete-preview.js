import {h, Component} from 'preact';

/*
TODO: 
 - listen to the chat input for the beginning of possible emotes
 - if found:
   - open preview/picker window
   - hijack arrow keys to make it move around the preview window
   - moving around auto completes the text
   - typing continues to filter
*/

export default class AutocompletePreview extends Component {
  state = {
    emotes : []
  }

  chatInput = document.getElementById("chat-txt-message")

  updateChatInput(emote) {
    let inputText = this.chatInput.value.split(' ');
    inputText.pop();
    inputText.push(emote);
    this.chatInput.value = inputText.join(' ');
    this.chatInput.focus();
    this.setState({emotes: []});
  }

  render(props,state){
    if (!props.symbol || state.emotes.length === 0) {
      return null;
    }

    return (
      <ul id="autocomplete-preview">

      </ul>
    )
  }
}