<script>
  import { onMount } from 'svelte';
  import MenuIcon from './MenuIcon.svelte';
  import Contact from '../sections/Contact.svelte';
  import General from '../sections/General.svelte';
  import Eta from '../satellites/Eta.svelte';
  import Snooze from '../satellites/Snooze.svelte';
  import Modal from '../Modal.svelte';
  import EmojiPreview from '../emoji/EmojiPreview.svelte';
  import { t } from '../stores/i18n.svelte';
  import DubsInfo from '../satellites/DubsInfo.svelte';
  import { settings } from '../stores/settings.svelte';
  import Snow from '../satellites/Snow.svelte';
  import UserInterface from '../sections/UserInterface.svelte';
  import Settings from '../sections/Settings.svelte';
  import Customize from '../sections/Customize.svelte';
  import SnoozeVideo from '../satellites/SnoozeVideo.svelte';

  onMount(() => {
    document.querySelector('html').classList.add('dubplus');
  });
</script>

<!-- 
  these components are controlled by Svelte but
  placed outside of the root menu container 
-->
<Snooze />
<MenuIcon />
<Eta />
<SnoozeVideo />
{#if settings.options.autocomplete}
  <EmojiPreview />
{/if}
{#if settings.options['dubs-hover']}
  <DubsInfo dubType="updub" />
  <DubsInfo dubType="downdub" />
  <DubsInfo dubType="grab" />
{/if}
{#if settings.options.snow}
  <Snow />
{/if}

<!-- this is the main menu -->
<section class="dubplus-menu">
  <p class="dubplus-menu-header">{t('Menu.title')}</p>
  <General />
  <UserInterface />
  <Settings />
  <Customize />
  <Contact />
</section>

<!-- One Modal that is controlled via the modalState -->
<Modal />

<style>
  /* the main container for the whole menu that slides in */
  .dubplus-menu {
    position: fixed;
    z-index: 999;
    background-color: rgba(10, 10, 10, 0.98);
    transition: transform 0.3s;
    width: var(--dubplus-menu-width);
    overflow-y: hidden;
    top: 58px;
    right: 0;
    transform: translateX(var(--dubplus-menu-width));
    box-sizing: border-box;
    color: var(--dubplus-text-color);
    font-family: var(--dubplus-font-family);
    font-size: var(--dubplus-font-size);
    line-height: 1.4;
    padding-bottom: 100px;
    height: calc(100% - 114px);
    overflow-y: auto;
    scrollbar-color: #999 transparent;
    scrollbar-width: thin;
  }

  .dubplus-menu-header {
    padding: 12px 15px;
    line-height: 1;
    margin: 0;
    border-bottom: 1px solid #222;
    font-size: 1.2em;
    color: #ccc;
  }

  /* this is toggled in MenuIcon component */
  .dubplus-menu:global(.dubplus-menu-open) {
    transform: translate3d(0, 0, 0);
  }
</style>
