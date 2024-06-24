<script>
  import MenuHeader from "../menu/MenuHeader.svelte";
  import MenuSection from "../menu/MenuSection.svelte";
  import MenuSwitch from "../menu/MenuSwitch.svelte";
  import { saveSetting, settings } from "../stores/settings.svelte";
  import { customize } from "../modules";
  import { t } from "../stores/i18n.svelte";

  customize.forEach((module) => {
    if (!settings.options[module.id]?.enabled) {
      settings.options[module.id] = { enabled: false };
    };
  });
</script>

<MenuHeader settingsId="customize" name={t("customize.title")} />
<MenuSection settingsId="customize">
  {#each customize as module}
    <MenuSwitch
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
