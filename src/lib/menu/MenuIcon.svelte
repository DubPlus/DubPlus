<script>
  import Logo from '../svg/Logo.svelte';
  import { teleport } from '../actions/teleport.svelte';
</script>

<button
  use:teleport={{ to: 'body' }}
  id="dubplus-menu-icon"
  type="button"
  aria-label="Dub+ menu"
  class="dubplus-icon"
  onclick={() => {
    document
      .querySelector('.dubplus-menu')
      ?.classList.toggle('dubplus-menu-open');
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

    cursor: pointer;

    position: absolute;
    top: 0;
    right: 1rem;
    z-index: 1000;

    /* 
      3.5rem is the height of the <header> set with class .h-14 
      1px is a bottom border of the header
    */
    height: calc(3.5rem - 1px);
    display: flex;
    flex-direction: column;
    justify-content: center;

    :global(svg) {
      width: 26px;
      height: 26px;
    }
  }

  :global(header > div:last-child) {
    padding-right: calc(0.5rem + 26px) !important;
  }
</style>
