<script>
  import Logo from '../svg/Logo.svelte';
  import { teleport } from '../actions/teleport.svelte';
  import { DUBPLUS_MENU_CONTAINER } from '../queup.ui';
</script>

<button
  use:teleport={{ to: DUBPLUS_MENU_CONTAINER }}
  id="dubplus-menu-icon"
  type="button"
  aria-label="Dub+ menu"
  class="dubplus-icon"
  onclick={() => {
    document
      .querySelector('.dubplus-menu')
      .classList.toggle('dubplus-menu-open');
  }}
>
  <Logo />
</button>

<style>
  /* This is the Dub+ icon in the top right that's always showing
     and triggers the open/close of Dub+ */
  .dubplus-icon {
    /* clear button styles */
    background: none;
    border: none;
    appearance: none;
    padding: 0;

    width: 26px;
    height: 26px;
    cursor: pointer;
    position: relative;
    display: inline-block;
    vertical-align: bottom;
    margin-left: 1rem;

    top: -4px;
  }
</style>
