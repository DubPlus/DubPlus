<script>
  import MenuHeader from '../menu/MenuHeader.svelte';
  import MenuSection from '../menu/MenuSection.svelte';
  import MenuItem from '../menu/MenuSwitch.svelte';
  import { userInterface } from '../modules';
  import { t } from '../stores/i18n.svelte';
  import MenuAction from '../menu/MenuAction.svelte';
</script>

<MenuHeader settingsId="user-interface" name={t('user-interface.title')} />
<MenuSection settingsId="user-interface">
  {#each userInterface as module (module.id)}
    {#if module.altIcon}
      <MenuAction
        id={module.id}
        label={module.label}
        description={module.description}
        icon={module.altIcon}
        onClick={module.onClick}
        init={module.init}
      />
    {:else}
      <MenuItem
        id={module.id}
        label={module.label}
        description={module.description}
        init={module.init}
        customize={module.custom}
        turnOn={module.turnOn}
        turnOff={module.turnOff}
      />
    {/if}
  {/each}
</MenuSection>
