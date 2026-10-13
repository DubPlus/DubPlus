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
  @media (max-width: 768px) {
    :global(header) {
      /*
       2.5rem is width of the mail icon in the mobile header
       0.75rem is padding
      */
      padding-right: calc(0.75rem + 2.5rem) !important;
    }
  }

  /* on mobile view need to adjust queup's header button layout */
  @media (min-width: 769px) {
    :global(header > *:last-child) {
      padding-right: calc(0.5rem + 26px) !important;
    }
  }

  /* This is the Dub+ icon in the top right that's always showing
     and triggers the open/close of Dub+ */
  .dubplus-icon {
    /* clear button styles */
    background: none;
    border: none;
    appearance: none;
    padding: 0;
    cursor: pointer;
    position: fixed;
    top: 0;
    top: anchor(--queup-header top);
    bottom: anchor(--queup-header bottom);
    right: 1rem;
    z-index: 1000;
    display: flex;
    flex-direction: column;
    justify-content: center;

    :global(svg) {
      width: 26px;
      height: 26px;
    }
  }
</style>
