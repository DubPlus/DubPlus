<script>
  import MenuHeader from "../MenuHeader.svelte";
  import MenuSection from "../MenuSection.svelte";
  import MenuLink from "../MenuLink.svelte";
</script>

<MenuHeader settingsId="contact" name="Contact" />
<MenuSection settingsId="contact">
  <MenuLink
    icon="bug"
    href="https://discord.gg/XUkG3Qy"
    text="Report bugs on Discord"
  />
  <MenuLink
    icon="reddit-alien"
    href="https://www.reddit.com/r/DubPlus/"
    text="Reddit"
  />
  <MenuLink
    icon="facebook"
    href="https://facebook.com/DubPlusScript"
    text="Facebook"
  />
  <MenuLink
    icon="twitter"
    href="https://twitter.com/DubPlusScript"
    text="Twitter"
  />
</MenuSection>
