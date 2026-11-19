<script>
  import MenuHeader from '../menu/MenuHeader.svelte';
  import MenuSection from '../menu/MenuSection.svelte';
  import MenuSwitch from '../menu/MenuSwitch.svelte';
  import MenuAction from '../menu/MenuAction.svelte';
  import { general } from '../modules';
  import { t } from '../stores/i18n.svelte';
  import { getCommandConfig } from '../../utils/module-setup-utils.js';

  general.forEach((module) => {
    const chatCommandConfig = getCommandConfig(module);
    window.QueUp.chat.registerCommand(chatCommandConfig);
  });
</script>

<MenuHeader settingsId="general" name={t('general.title')} />
<MenuSection settingsId="general">
  {#each general as module (module.id)}
    {#if module.altIcon}
      <MenuAction
        id={module.id}
        label={module.label}
        description={module.description}
        icon={module.altIcon}
        onClick={module.onClick}
        init={module.init}
        modOnly={module.modOnly}
        desktopOnly={module.desktopOnly}
      />
    {:else}
      <MenuSwitch
        id={module.id}
        label={module.label}
        description={module.description}
        init={module.init}
        customize={module.custom}
        modOnly={module.modOnly}
        desktopOnly={module.desktopOnly}
        turnOn={module.turnOn}
        turnOff={module.turnOff}
      />
    {/if}
  {/each}
</MenuSection>
