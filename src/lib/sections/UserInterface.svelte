<script>
  import MenuHeader from "../menu/MenuHeader.svelte";
  import MenuSection from "../menu/MenuSection.svelte";
  import MenuItem from "../menu/MenuSwitch.svelte";
  import { saveSetting, settings } from "../stores/settings.svelte";
  import { userInterface } from "../modules";
  import { t } from "../stores/i18n.svelte";
  import MenuAction from "../menu/MenuAction.svelte";

  userInterface.forEach((module) => {
    if (!settings.options[module.id]?.enabled) {
      settings.options[module.id] = { enabled: false };
    };
  });
</script>

<MenuHeader settingsId="user-interface" name={t("user-interface.title")} />
<MenuSection settingsId="user-interface">
  {#each userInterface as module}
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
        onToggle={(on) => {
          if (on) module.turnOn();
          else module.turnOff();

          saveSetting("option", module.id, on);
        }}
      />
    {/if}
  {/each}
</MenuSection>
