<script>
  import MenuHeader from "../menu/MenuHeader.svelte";
  import MenuSection from "../menu/MenuSection.svelte";
  import MenuItem from "../menu/MenuSwitch.svelte";
  import { saveSetting } from "../stores/settings.svelte";
  import { settings as settingsModules } from "../modules";
  import { t } from "../stores/i18n.svelte";
</script>

<MenuHeader settingsId="settings" name={t("settings.title")} />
<MenuSection settingsId="settings">
  {#each settingsModules as module}
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
  {/each}
</MenuSection>
