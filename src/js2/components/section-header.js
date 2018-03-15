
import {h, Component} from 'preact';

export default function SectionHeader (props) {
  return (
    <div id={props.id} className="dubplus-menu-section-header">
        <span className={`fa fa-angle-${props.arrow}`}></span>
        <p>{props.category}</p>
    </div>
  );
}