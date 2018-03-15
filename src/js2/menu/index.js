/**
 * DubPlus Menu Container
 */
import { h, Component } from 'preact';
import snooze from '../components/snooze.js';
import eta from '../components/eta.js';
import GeneralSection from './general/index.js';

export default class DubPlusMenu extends Component {

  componentDidMount() {
    // load this async so it doesn't block the rest of the menu render
    // since this snooze button is completely independent from the menu
    setTimeout(()=>{
      snooze();
      eta();
    }, 1);
  }

  render() {
    return (
      <section className="dubplus-menu">
        <p className="dubplus-menu-header">Dub+ Options</p>
        <GeneralSection />
      </section>
    )
  }
}