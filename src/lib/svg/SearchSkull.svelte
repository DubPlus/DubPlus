<script>
  /** @type {{ class?: string }} */
  let { class: className = undefined } = $props();
</script>

<svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
  class={['lucide lucide-search preview-icon', className]}
>
  <path d="m21 21-4.34-4.34" fill="none" />
  <circle cx="11" cy="11" r="8" fill="none" />
  <g
    transform="translate(11 11) scale(0.55) translate(-12 -12)"
    stroke-width="2.5"
  >
    <path d="m12.5 17-.5-1-.5 1h1z" />
    <path
      d="M15 22a1 1 0 0 0 1-1v-1a2 2 0 0 0 1.56-3.25 8 8 0 1 0-11.12 0A2 2 0 0 0 8 20v1a1 1 0 0 0 1 1z"
    />
    <circle cx="15" cy="12" r="1" />
    <circle cx="9" cy="12" r="1" />
  </g>
</svg>
