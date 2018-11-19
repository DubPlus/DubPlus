import {h, Component} from 'preact';


export default class EmojiPreview extends Component {
  state = {
    isOpen : false,
    current : null
  }
  
  onSelect = (e) => {

  }

  render(props,state){
    let items = props.list.map((e,i)=>{
      let css = `preview-item ${e.type}-previews`;
      if (props.activeIndex === i) {
        css += ' selected';
      }
      return (
        <li key={`emo-${i}`} className={css}>
          <img className="ac-image" src={e.src} />
          <span className="ac-text">{e.text}</span>
        </li>
      )
    });

    return (
      <ul id="autocomplete-preview">
        {items}
      </ul>
    );
  }
}