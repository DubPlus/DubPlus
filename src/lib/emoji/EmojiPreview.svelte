<script>
  import { teleport } from "../actions/teleport";
  import { emojiState } from "./emojiState.svelte";

  $effect(() => {
    if (
      emojiState.emojiList.length > 0 &&
      typeof emojiState.selectedIndex === "number"
    ) {
      // scroll the li element into view
      const selected = document.querySelector(".preview-item.selected");
      if (selected) {
        selected.scrollIntoView({
          block: "nearest",
          inline: "nearest",
          behavior: "smooth",
        });
      }
    }
  });
</script>

<ul
  use:teleport={[".pusher-chat-widget-input", "prepend"]}
  id="autocomplete-preview"
  class:ac-show={emojiState.emojiList.length > 0}
>
  {#each emojiState.emojiList as { src, text, platform, alt }, i (src)}
    <li
      class={`preview-item ${platform}-previews`}
      class:selected={i === emojiState.selectedIndex}
    >
      <div class="ac-image">
        <img {src} {alt} title={alt} />
      </div>
      <span class="ac-text">{text}</span>
      {#if i === emojiState.selectedIndex}
        <span class="ac-list-press-enter">
          press <kbd>enter</kbd> or <kbd>tab</kbd> to select
        </span>
      {/if}
    </li>
  {/each}
</ul>

<style>
  /****************************************************
 * Emoji and emote section
 * twitch logo white: https://i.imgur.com/FhzONPQ.png
 * bttv logo white: https://i.imgur.com/oTfAI0O.png
 */

  ul {
    overflow: auto;
    display: block;
    position: absolute;
    bottom: 54px;
    background-color: rgba(0, 0, 0, 0.9);
    width: 100%;
    height: auto;
    max-height: 0;
    padding: 0;
    list-style-type: none;
    margin: 0;
  }

  li {
    display: block;
    padding: 6px 10px;
    margin: 0;
    color: #fff;
  }

  li:hover,
  li.selected {
    background-color: #555;
  }

  li:focus {
    outline: none;
  }

  .preview-item {
    background-repeat: no-repeat;
    background-size: 25px;
    background-position: 98% center;
    display: flex;
    align-items: center;
  }

  :global(.twitch-previews) {
    background-image: url(https://i.imgur.com/FhzONPQ.png);
  }

  :global(.bttv-previews) {
    background-image: url(https://i.imgur.com/oTfAI0O.png);
  }

  :global(.tasty-previews) {
    background-image: url(#{$resourceSrc}/emotes/tastycat/21.png);
  }

  :global(.ffz-previews) {
    background-image: url(https://i.imgur.com/DuJfI4T.png);
  }

  .ac-text {
    font-size: 0.8em;
    padding-left: 20px;
  }

  .ac-image {
    width: 1.4em;
  }

  img {
    width: 100%;
    height: auto;
  }

  .ac-show {
    border: 1px solid #202020;
    border-bottom: 1px solid #878c8e;
    max-height: 164px;
    transition: 0.4s;
  }

  .ac-list-press-enter {
    flex: 1;
    text-align: center;
    font-size: 0.8em;
  }
</style>
