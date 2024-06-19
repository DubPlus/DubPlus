<script>
  import { teleport } from "../actions/teleport";
  import { emojiState } from "./emojiState.svelte";

  $effect(() => {
    console.log(emojiState);
  });
</script>

<ul
  use:teleport={[".pusher-chat-widget-input", "prepend"]}
  id="autocomplete-preview"
  class:ac-show={emojiState.emojiList.length > 0}
>
  {#each emojiState.emojiList as { src, text, platform, alt }, i}
    <li class={`preview-item ${platform}-previews`}>
      <div class="ac-image">
        <img {src} {alt} title={alt} />
      </div>
      <span class="ac-text">{text}</span>
      {#if i === emojiState.selectedIndex}
        <div class="ac-list-press-enter">
          press <kbd>enter</kbd> to select
        </div>
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

  #autocomplete-preview {
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

  #autocomplete-preview li {
    display: block;
    padding: 6px 10px;
    margin: 0;
  }

  #autocomplete-preview li:hover,
  #autocomplete-preview li.selected {
    background-color: #555;
  }

  #autocomplete-preview li:focus {
    outline: none;
  }

  #autocomplete-preview .preview-item {
    background-repeat: no-repeat;
    background-size: 25px;
    background-position: 98% center;
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

  #autocomplete-preview span {
    font-size: 0.8em;
    display: inline-block;
    padding-left: 20px;
    position: relative;
    top: -7px;
  }

  #autocomplete-preview .ac-image {
    width: 1.4em;
    display: inline-block;
  }
  #autocomplete-preview .ac-image img {
    width: 100%;
    height: auto;
  }

  .users-preview .ac-image {
    border-radius: 100%;
  }

  #autocomplete-preview.ac-show {
    border: 1px solid #202020;
    border-bottom: 1px solid #878c8e;
    max-height: 164px;
    transition: 0.4s;
  }

  .twitch-emote.emoji,
  .bttv-emote.emoji {
    max-width: 1.75rem !important;
    height: auto !important;
  }

  /* 
  tasty emotes get a specific Width and Height from the API 
  The max width is 75px
*/
  .tasty-emote.emoji {
    max-width: 75px !important;
    width: auto !important;
    height: auto !important;
  }
</style>
