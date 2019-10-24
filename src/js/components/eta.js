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

export default class ETA extends Component {
  state = {
    show : false,
    booth_time : ''
  };

  getEta() {
    var time = 4;
    var current_time = parseInt(document.querySelector('#player-controller div.left ul li.infoContainer.display-block div.currentTime span.min').textContent);
    var booth_duration = parseInt(document.querySelector('.queue-position').textContent);
    var booth_time = (booth_duration * time - time) + current_time;
    return booth_time >= 0 ? booth_time : 'You\'re not in the queue'; 
  }

  showTooltip = () => {
    var tooltipText = this.getEta();
    this.setState({
      show: true,
      booth_time: tooltipText
    });
  }

  hideTooltip = () => {
    this.setState({show:false});
  }

  updateLeft() {
    if (css.left) {
      return css
    }
    const left = this.etaRef.getBoundingClientRect().left
    css.left = left + "px"
    return css
  }

  render(props,state) {
    return (
      <span className="icon-history eta_tooltip_t" 
        ref={s => (this.etaRef = s)}
        onMouseOver={this.showTooltip}
        onMouseOut={this.hideTooltip}>
        {this.state.show &&
          <span className="eta_tooltip" style={this.updateLeft()}>{this.state.booth_time}</span>
        }
      </span>
    );
  }
}