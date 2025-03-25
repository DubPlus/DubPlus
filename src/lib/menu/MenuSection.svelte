<script>
  /** @type {{settingsId: string, children: import('svelte').Snippet}} */
  let { settingsId, children } = $props();
</script>

<ul
  id={`dubplus-menu-section-${settingsId}`}
  aria-labelledby={`dubplus-menu-section-header-${settingsId}`}
  class="dubplus-menu-section"
  role="region"
>
  {@render children()}
</ul>

<style>
  ul {
    padding: 0 15px;
    border-bottom: 1px solid #222;
    max-height: 531px;

    /* 
       18 - number of list items in the General section.
            General section has the most features so we use that one.
            If we add more items, we need to update this value.

       38.2px = 18.2px + 10px + 10px 
            18.2px = height of each list item
            10px = top margin of each list item
            10px = bottom margin of each list item
     */
    max-height: calc(18 * 38.2px);
    transition: max-height 0.3s;
    overflow: hidden;
    margin: 0;
    list-style-type: none;
  }
  :global([aria-expanded='false']) + ul {
    max-height: 0;
    border: none;
  }
  @supports (height: calc-size(auto, size)) {
    ul {
      max-height: unset;
      height: calc-size(auto, size);
      transition: height 0.3s;
    }
    :global([aria-expanded='false']) + ul {
      height: 0;
      max-height: unset;
    }
  }
</style>
