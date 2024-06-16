
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
   * if the feature has an edit modal, this object will be used to create the modal
   */
  custom?: {
    /**
     * the id where the data will be stored in the settings.custom object
     */
    id: string;
    /**
     * the title of the modal
     */
    title: string;
    /**
     * Description or information text that goes under the title of the modal
     */
    content?: string;
    /**
     * placeholder value that will be displayed in the textarea field
     */
    placeholder?: string;

    /** 
     * how many characters allowd inthe textarea field (default: 999, max: 999)
     */
    maxlength?: string;

    onConfirm: (value: string) => void;
  };
}


