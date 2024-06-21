<script>
  /**
   * This component mounts the loading message on startup.
   * All of the styles are inlined here so we can load this component faster
   * and discard them after since they will no longer be needed.
   */
  import Logo from "./menu/Logo.svelte";
  import { t } from "./stores/i18n.svelte";
</script>

<div class="dubplus-waiting">
  <div style="width: 26px; margin-right:5px">
    <Logo />
  </div>
  <span style="flex: 1;">{t("Loading.text")}</span>
</div>

<style>
  .dubplus-waiting {
    font-family: "Trebuchet MS", Helvetica, sans-serif;
    z-index: 2147483647;
    color: white;
    position: fixed;
    top: 69px;
    right: 13px;
    background: #222;
    padding: 10px;
    line-height: 1;
    box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.75);
    border-radius: 5px;
    overflow: hidden;
    width: 230px;
    display: flex;
    align-items: center;
  }
</style>
