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
  turnOff: () => void;
  turnOn: () => void;
  /**
   * Optionally run some code when Dub+ is loaded
   */
  init?: () => void;

  /**
   * if the feature has an edit modal, this object will be used to create the modal
   */
  custom?: ModalProps
}


