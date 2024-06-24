<script>
  import MenuHeader from "../menu/MenuHeader.svelte";
  import MenuSection from "../menu/MenuSection.svelte";
  import MenuLink from "../menu/MenuLink.svelte";
  import { t } from "../stores/i18n.svelte";
</script>

<MenuHeader settingsId="contact" name={t("contact.title")} />
<MenuSection settingsId="contact">
  <MenuLink
    icon="bug"
    href="https://discord.gg/XUkG3Qy"
    text={t("contact.bugs")}
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
