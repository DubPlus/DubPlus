/**
 * ETA
 *
 * This module is not a menu item, it is run once on load
 */

import { h, render, Component } from 'preact';

var css = {
  position: 'absolute',
  font: '1rem/1.5 proxima-nova,sans-serif',
  display: 'block',
  left: '-33px',
  cursor: 'pointer',
  borderRadius: '1.5rem',
  padding: '8px 16px',
  background: '#fff',
  fontWeight: '700',
  fontSize: '13.6px',
  textTransform: 'uppercase',
  color: '#000',
  opacity: '0.8',
  textAlign: 'center',
  zIndex: '9'
};

class ETA extends Component {

  constructor(props){
    super(props);
    this.state = {
      show : false,
      booth_time : ''
    };
    this.showTooltip = this.showTooltip.bind(this);
    this.hideTooltip = this.hideTooltip.bind(this);
  }

  getEta() {
    var time = 4;
    var current_time = parseInt(document.querySelector('#player-controller div.left ul li.infoContainer.display-block div.currentTime span.min').textContent);
    var booth_duration = parseInt(document.querySelector('.queue-position').textContent);
    var booth_time = (booth_duration * time - time) + current_time;
    return booth_time >= 0 ? booth_time : 'You\'re not in the queue'; 
  }

  showTooltip(){
    var tooltipText = this.getEta();
    this.setState({
      show: true,
      booth_time: tooltipText
    });
  }

  hideTooltip() {
    this.setState({show:false});
  }

  render() {
    return (
      <span className="icon-history eta_tooltip_t">
        {this.state.show &&
          <span className="eta_tooltip" style={css}>{this.state.booth_time}</span>
        }
      </span>
    );
  }
}

export default function() {
  render( <ETA />, document.querySelector('.player_sharing') );
}