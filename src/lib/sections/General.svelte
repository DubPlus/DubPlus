<script>
  import MenuHeader from '../menu/MenuHeader.svelte';
  import MenuSection from '../menu/MenuSection.svelte';
  import MenuSwitch from '../menu/MenuSwitch.svelte';
  import { general } from '../modules';
  import { t } from '../stores/i18n.svelte';
</script>

<MenuHeader settingsId="general" name={t('general.title')} />
<MenuSection settingsId="general">
  {#each general as module (module.id)}
    <MenuSwitch
      id={module.id}
      label={module.label}
      description={module.description}
      init={module.init}
      customize={module.custom}
      modOnly={module.modOnly}
      turnOn={module.turnOn}
      turnOff={module.turnOff}
    />
  {/each}
</MenuSection>
