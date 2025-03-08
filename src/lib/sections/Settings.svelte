<script>
  import MenuHeader from '../menu/MenuHeader.svelte';
  import MenuSection from '../menu/MenuSection.svelte';
  import MenuItem from '../menu/MenuSwitch.svelte';
  import { settings } from '../stores/settings.svelte';
  import { settingsModules } from '../modules';
  import { t } from '../stores/i18n.svelte';

  settingsModules.forEach((module) => {
    if (!settings.options[module.id]) {
      settings.options[module.id] = false;
    }
  });
</script>

<MenuHeader settingsId="settings" name={t('settings.title')} />
<MenuSection settingsId="settings">
  {#each settingsModules as module (module.id)}
    <MenuItem
      id={module.id}
      label={module.label}
      description={module.description}
      init={module.init}
      customize={module.custom}
      turnOn={module.turnOn}
      turnOff={module.turnOff}
    />
  {/each}
</MenuSection>
