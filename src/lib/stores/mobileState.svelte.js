import { MediaQuery } from 'svelte/reactivity';
import { mobileBreakpoint } from '../queup.ui';

/** Read `mobile.current` for a reactive boolean */
export const mobile = new MediaQuery(mobileBreakpoint);
