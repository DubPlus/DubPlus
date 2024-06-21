<script>
  import MenuHeader from "../menu/MenuHeader.svelte";
  import MenuSection from "../menu/MenuSection.svelte";
  import MenuItem from "../menu/MenuItem.svelte";
  import { saveSetting } from "../stores/settings.svelte";
  import { general } from "../modules";
</script>

<MenuHeader settingsId="general" name="General" />
<MenuSection settingsId="general">
  {#each general as module}
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
