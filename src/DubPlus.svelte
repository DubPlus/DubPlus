<script>
  import Menu from './lib/menu/Menu.svelte';
  import pkg from '../package.json';

  window.dubplus = Object.assign(window.dubplus || {}, {
    name: pkg.name,
    version: pkg.version,
    description: pkg.description,
    license: pkg.license,
    homepage: pkg.homepage,
  });
</script>

<Menu />
