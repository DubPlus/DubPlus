import { h } from "preact";
import { createPortal } from "preact/compat";

const Portal = ({children, into}) => {
  return createPortal(children, into)
}

export default Portal