<script>
  import MenuHeader from "../MenuHeader.svelte";
  import MenuSection from "../MenuSection.svelte";
  import MenuItem from "../MenuItem.svelte";

  import { general } from "../modules";
</script>

<MenuHeader settingsId="general" name="General" />
<MenuSection settingsId="general">
  {#each general as module}
    <MenuItem
      id={module.id}
      label={module.label}
      description={module.description}
      onToggle={(on) => {
        if (on) module.turnOn();
        else module.turnOff();
      }}
    />
  {/each}
</MenuSection>
