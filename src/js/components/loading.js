import { h, Component } from 'preact';
import settings from '@/utils/UserSettings.js';

var waitingStyles = {
  fontFamily : "'Trebuchet MS', Helvetica, sans-serif",
  zIndex : '2147483647',
  color : 'white', 
  position : 'fixed',
  top: '69px',
  right : '-250px',
  background :'#222',
  padding: '10px',
  lineHeight: 1,
  boxShadow : '0px 0px 5px 0px rgba(0,0,0,0.75)',
  borderRadius : '5px',
  overflow : 'hidden',
  width : '230px',
  transition : 'right 200ms',
  cursor: 'pointer'
};

var dpIcon = {
  float : 'left',
  width : '26px',
  marginRight : '5px'
};

var dpText = {
  display : 'table-cell',
  width: '10000px',
  paddingTop : '5px'
};

export default class LoadingNotice extends Component {
  state = {
    mainStyles : waitingStyles
  }

  componentDidMount() {
    setTimeout(()=>{
      this.setState((prevState, props) => ({
        mainStyles: Object.assign({}, prevState.mainStyles, {right:'13px'})
      }))
    },200);
  }

  componentWillUnmount() {
    this.dismiss();
  }

  dismiss = () => {
    this.setState((prevState, props) => ({
      mainStyles: Object.assign({}, prevState.mainStyles, {right:'-250px'})
    }))
  }

  render(props,state) {
    return (
      <div style={state.mainStyles} onClick={this.dismiss}>
        <div style={dpIcon}>
          <img src={settings.srcRoot+'/images/dubplus.svg'} alt="DubPlus icon" />
        </div>
        <span style={dpText}>
          { props.text || 'Waiting for Dubtrack...' }
        </span>
      </div>
    );
  }
}
