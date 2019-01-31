/**
 * DubPlus Menu Container
 */
import { h, Component } from 'preact';
import snooze from '../components/snooze.js';
import eta from '../components/eta.js';
import GeneralSection from './general/index.js';
import UISection from './ui/index.js';

export default class DubPlusMenu extends Component {

  componentDidMount() {
    // load this async so it doesn't block the rest of the menu render
    // since these buttons are completely independent from the menu
    setTimeout(()=>{
      snooze();
      eta();
    }, 10);
  }

  render(props,state) {
    return (
      <section className="dubplus-menu">
        <p className="dubplus-menu-header">Dub+ Options</p>
        <GeneralSection />
        <UISection />
      </section>
    )
  }
}