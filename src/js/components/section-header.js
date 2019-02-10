import {h, Component} from 'preact';

export default function SectionHeader (props) {
  let arrow = props.open === "open" ? 'down' : 'right';
  return (
    <div id={props.id} 
         onClick={props.onClick}
         className="dubplus-menu-section-header">
        <span className={`fa fa-angle-${arrow}`}></span>
        <p>{props.category}</p>
    </div>
  );
}