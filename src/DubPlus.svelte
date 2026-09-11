<script>
  import Menu from './lib/menu/Menu.svelte';
  import pkg from '../package.json';

  window.dubplus = window.dubplus || {};
  window.dubplus.name = pkg.name;
  window.dubplus.version = pkg.version;
  window.dubplus.description = pkg.description;
  window.dubplus.license = pkg.license;
  window.dubplus.homepage = pkg.homepage;
</script>

<Menu />
