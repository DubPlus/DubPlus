<script>
  import { onMount } from "svelte";
  import { addSnooze } from "./snooze";
  import { addETA } from "./eta";
  import { addMenuIcon } from "./menu-icon";
  import { loadExternalCss } from "../utils/css";
  import Contact from "./Contact.svelte";

  onMount(() => {
    loadExternalCss(
      "https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css",
      "dp-font-awesome",
    );
    addSnooze();
    addETA();
    addMenuIcon();
    document.querySelector("html").classList.add("dubplus");
  });
</script>

<section class="dubplus-menu">
  <p class="dubplus-menu-header">Dub+ Options</p>
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
