<script>
  import { teleport } from '../actions/teleport.svelte';
  import { insertEmote } from '../modules/autocomplete';
  import { CHAT_INPUT_CONTAINER, getChatInput } from '../queup.ui';
  import { t } from '../stores/i18n.svelte';
  import { emojiState } from './emojiState.svelte';

  $effect(() => {
    if (
      emojiState.emojiList.length > 0 &&
      typeof emojiState.selectedIndex === 'number'
    ) {
      // scroll the li element into view
      const selected = document.querySelector('.preview-item.selected');
      if (selected) {
        selected.scrollIntoView({
          block: 'nearest',
          inline: 'nearest',
          behavior: 'smooth',
        });
      }
    }
  });

  /**
   * @param {number} index
   */
  function handleClick(index) {
    const inputEl = getChatInput();
    insertEmote(inputEl, index);
    inputEl.focus();
  }
</script>

<div
  use:teleport={{ to: CHAT_INPUT_CONTAINER, position: 'prepend' }}
  class="ac-preview-container"
  class:ac-show={emojiState.emojiList.length > 0}
>
  <div class="ac-header">
    {t('autocomplete.preview.select')}
  </div>
  <ul id="autocomplete-preview">
    {#each emojiState.emojiList as { src, text, platform, alt }, i (src + platform)}
      <!-- svelte-ignore a11y_click_events_have_key_events -->
      <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
      <li
        class={`preview-item ${platform}-previews`}
        class:selected={i === emojiState.selectedIndex}
        onclick={() => handleClick(i)}
        title={text}
      >
        <div class="ac-image">
          <img {src} {alt} title={alt} />
        </div>
      </li>
    {/each}
  </ul>
  <span class="ac-text-preview">
    {emojiState.emojiList[emojiState.selectedIndex]?.text}
  </span>
</div>

<style>
  /****************************************************
 * Emoji and emote section
 * twitch logo white: https://i.imgur.com/FhzONPQ.png
 * bttv logo white: https://i.imgur.com/oTfAI0O.png
 */

  .ac-preview-container {
    position: absolute;
    bottom: 54px;
    width: 100%;
    height: auto;
    max-height: 0;
    background-color: rgba(0, 0, 0, 0.9);
    display: flex;
    flex-direction: column;
  }
  .ac-header {
    display: none;
    position: sticky;
    top: 0;
    background-color: rgba(0, 0, 0, 0.9);
    padding: 5px 10px;
    border-bottom: 1px solid #515253;
  }
  .ac-show {
    border: 1px solid #202020;
    border-bottom: 1px solid #878c8e;
    max-height: 200px;
    transition: 0.4s;
  }
  .ac-show .ac-header {
    display: block;
  }

  ul {
    display: block;
    padding: 0;
    list-style-type: none;
    margin: 0;
    display: flex;
    flex-wrap: wrap;
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
  }

  li {
    width: 50px;
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

  /*
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
*/
  .ac-text {
    font-size: 0.8em;
    padding-left: 20px;
  }

  .ac-image {
    width: 30px;
    height: 30px;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  .ac-list-press-enter {
    flex: 1;
    text-align: center;
    font-size: 0.8em;
  }

  .ac-text-preview {
    padding: 5px 10px;
    background-color: rgba(0, 0, 0, 0.9);
    font-size: 0.8em;
    border-top: 1px solid #515253;
    display: none;
  }
  .ac-show .ac-text-preview {
    display: block;
  }
</style>
