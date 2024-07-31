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
    max-height: 500px;
    transition: max-height 0.3s;
    overflow: hidden;
    margin: 0;
    list-style-type: none;
  }
  :global([aria-expanded="false"]) + ul {
    max-height: 0;
    border: none;
  }
</style>
