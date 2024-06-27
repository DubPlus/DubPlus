import type { ModalProps } from "../../global";

export interface DubPlusModule {
  /**
   * Id and property name that will be used to store the state of the feature in 
   * the settings.options object
   */
  id: string;
  label: string;
  description: string;
  category: string;
  modOnly?: boolean;
  turnOff?: () => void;
  turnOn?: () => void;
  /**
   * Optionally run some code when Dub+ is loaded
   */
  init?: () => void;

  /**
   * if the feature has an edit modal, this object will be used to create the modal
   */
  custom?: ModalProps

  /**
   * If this is provided then instead of the menu item rendering
   * a switch, it will render this icon instead.
   */
  altIcon?: string;
  /**
   * This pairs with the altIcon property. If this is provided then
   * the altIcon will be clickable and this function will be called
   */
  onClick?: () => void;
}


