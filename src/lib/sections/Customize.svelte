<script>
  import MenuHeader from '../menu/MenuHeader.svelte';
  import MenuSection from '../menu/MenuSection.svelte';
  import MenuSwitch from '../menu/MenuSwitch.svelte';
  import { saveSetting } from '../stores/settings.svelte';
  import { customize } from '../modules';
  import { t } from '../stores/i18n.svelte';
</script>

<MenuHeader settingsId="customize" name={t('customize.title')} />
<MenuSection settingsId="customize">
  {#each customize as module (module.id)}
    <MenuSwitch
      id={module.id}
      label={module.label}
      description={module.description}
      init={module.init}
      customize={module.custom}
      onToggle={(on, onMount) => {
        if (on) module.turnOn();
        else module.turnOff();

        if (!onMount) {
          saveSetting('option', module.id, on);
        }
      }}
    />
  {/each}
</MenuSection>
