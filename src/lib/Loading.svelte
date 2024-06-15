<script>
  /**
   * This component mounts the loading message on startup.
   * All of the styles are inlined here so we can load this component faster
   * and discard them after since they will no longer be needed.
   */
  import { settings } from "./settings.svelte.js";

  /** @type {{ text?: string }} */
  let { text = "Waiting for QueUp..." } = $props();

  const waitingStyles = [
    "font-family: 'Trebuchet MS', Helvetica, sans-serif",
    "z-index: 2147483647",
    "color: white",
    "position: fixed",
    "top: 69px",
    "right: 13px",
    "background: #222",
    "padding: 10px",
    "line-height: 1",
    "box-shadow: 0px 0px 5px 0px rgba(0,0,0,0.75)",
    "border-radius: 5px",
    "overflow: hidden",
    "width: 230px",
    "display: flex",
    "align-items: center",
  ].join(";");
</script>

<div class="dubplus-waiting" style={waitingStyles}>
  <div style="width: 26px; margin-right:5px">
    <img 
      style="display: block; width: 100%;"
      src="{settings.srcRoot}/images/dubplus.svg" 
      alt="DubPlus icon" />
  </div>
  <span style="flex: 1;">{text}</span>
</div>
