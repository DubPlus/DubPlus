import {h, Component} from 'preact';

/*
TODO: 
 - Create the hidden preview component
 - listen to the chat input for the beginning of possible emotes
 - if found:
   - open preview/picker window
   - hijack arrow keys to make it move around the preview window
   - moving around auto completes the text
   - typing continues to filter
*/

export default class AutocompletePreview extends Component {  

  render(props,open){
    return (
      <ul id="autocomplete-preview">

      </ul>
    )
  }
}