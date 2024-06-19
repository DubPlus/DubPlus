<script>
  import { onMount } from "svelte";
  import MenuIcon from "./MenuIcon.svelte";
  import { loadExternalCss } from "../../utils/css";
  import Contact from "../sections/Contact.svelte";
  import General from "../sections/General.svelte";
  import Eta from "../satellites/Eta.svelte";
  import Snooze from "../satellites/Snooze.svelte";
  import Modal from "../Modal.svelte";
  import EmojiPreview from "../emoji/EmojiPreview.svelte";

  onMount(() => {
    loadExternalCss(
      "https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css",
      "dp-font-awesome",
    );
    document.querySelector("html").classList.add("dubplus");
  });
</script>

<!-- these components are satellites that are controlled by Svelte but
  placed outside of the root menu container -->
<MenuIcon />
<Snooze />
<Eta />
<EmojiPreview />
<!-- this is the main menu -->
<section class="dubplus-menu">
  <p class="dubplus-menu-header">Dub+ Options</p>
  <General />
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
    color: #999;
    font-family: "Trebuchet MS", Helvetica, sans-serif;
    font-size: 13px;
    line-height: 1.4;
    padding-bottom: 100px;
    height: calc(100% - 114px);
    overflow-y: auto;
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
