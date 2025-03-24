import type { ModalProps } from '../../global';
import type { Component } from 'svelte';

export interface DubPlusModule {
  /**
   * Id and property name that will be used to store the state of the feature in
   * the settings.options object
   */
  id: string;

  /**
   * The name of the module that will be displayed in the menu next to the switch
   */
  label: string;

  /**
   * The description of the module that will be displayed when you hover
   */
  description: string;

  /**
   * Which part of the menu this module will be displayed in
   */
  category: string;

  modOnly?: boolean;

  /**
   * Runs when the module is enabled
   */
  turnOn?: (onLoad?: boolean) => void;

  /**
   * Runs when the module is disabled
   */
  turnOff?: () => void;

  /**
   * Optionally run some code when Dub+ is loaded
   */
  init?: () => void;

  /**
   * if the feature has an edit modal, this object will be used to create the modal
   */
  custom?: ModalProps;

  /**
   * If this is provided then instead of the menu item rendering
   * a switch, it will render this icon instead. The icon should be an svg
   * element as a .svelte file.
   */
  altIcon?: Component;

  /**
   * This pairs with the altIcon property. If this is provided then
   * the altIcon will be clickable and this function will be called
   */
  onClick?: () => void;
}
