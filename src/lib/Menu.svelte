<script>
  import { onMount } from "svelte";
  import MenuIcon from "./MenuIcon.svelte";
  import { loadExternalCss } from "../utils/css";
  import Contact from "./sections/Contact.svelte";
  import General from "./sections/General.svelte";
  import Eta from "./Eta.svelte";
  import Snooze from "./Snooze.svelte";

  onMount(() => {
    loadExternalCss(
      "https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css",
      "dp-font-awesome",
    );
    document.querySelector("html").classList.add("dubplus");
  });
</script>

<!-- these components are teleported to different parts of the UI -->
<MenuIcon />
<Eta />
<Snooze />
<!-- this is the main menu -->
<section class="dubplus-menu">
  <p class="dubplus-menu-header">Dub+ Options</p>
  <General />
  <Contact />
</section>

<style>
  .dubplus-menu-header {
    padding: 12px 15px;
    line-height: 1;
    margin: 0;
    border-bottom: 1px solid #222;
    font-size: 1.2em;
    color: #ccc;
  }
</style>
