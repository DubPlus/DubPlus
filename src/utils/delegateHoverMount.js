/**
 * @import { Component } from 'svelte';
 */

import { mount, unmount } from 'svelte';

/**
 * @template {Record<string, any>} Props
 * @param {string} selector Matched against event targets via closest().
 * @param {Component<Props>} component
 * @param {(target: Element) => Props} getProps
 * @param {object} [options]
 * @param {ParentNode & EventTarget} [options.root]
 * @param {number} [options.delay]
 * @returns {() => void} Teardown.
 */
export function delegateHoverMount(
  selector,
  component,
  getProps,
  options = {},
) {
  const { root = document.body, delay = 100 } = options;

  /** @type {Element | null} */ let active = null;
  /** @type {Record<string, any> | null} */ let instance = null;
  /** @type {HTMLDivElement | null} */ let container = null;
  /** @type {ReturnType<typeof setTimeout> | undefined} */ let timer;

  const teardown = () => {
    const inst = instance;
    const el = container;
    instance = container = active = null;
    if (inst) unmount(inst);
    el?.remove();
  };

  /** @param {Element} target */
  const show = (target) => {
    clearTimeout(timer);
    if (active === target) return;
    if (instance) teardown();

    active = target;
    container = document.createElement('div');
    document.body.appendChild(container);
    instance = mount(component, { target: container, props: getProps(target) });
  };

  /** @param {Event} e */
  const onOver = (e) => {
    const el = /** @type {Element | null} */ (e.target);
    const target = el?.closest?.(selector);
    if (target) show(target);
  };

  /** @param {Event} e */
  const onOut = (e) => {
    const el = /** @type {Element | null} */ (e.target);
    if (el?.closest?.(selector) !== active || !active) return;
    const to = /** @type {Node | null} */ (
      /** @type {PointerEvent} */ (e).relatedTarget
    );
    if (to && (active.contains(to) || container?.contains(to))) return;
    clearTimeout(timer);
    timer = setTimeout(teardown, delay);
  };

  root.addEventListener('pointerover', onOver, true);
  root.addEventListener('pointerout', onOut, true);

  return () => {
    clearTimeout(timer);
    root.removeEventListener('pointerover', onOver, true);
    root.removeEventListener('pointerout', onOut, true);
    teardown();
  };
}
