<script>
  import MenuHeader from "../menu/MenuHeader.svelte";
  import MenuSection from "../menu/MenuSection.svelte";
  import MenuLink from "../menu/MenuLink.svelte";
  import { t } from "../stores/i18n.svelte";
  import IconBug from "../svg/IconBug.svelte";
  import IconReddit from "../svg/IconReddit.svelte";
  import IconFacebook from "../svg/IconFacebook.svelte";
  import IconTwitter from "../svg/IconTwitter.svelte";
</script>

<MenuHeader settingsId="contact" name={t("contact.title")} />
<MenuSection settingsId="contact">
  <MenuLink
    icon={IconBug}
    href="https://discord.gg/XUkG3Qy"
    text={t("contact.bugs")}
  />
  <MenuLink
    icon={IconReddit}
    href="https://www.reddit.com/r/DubPlus/"
    text="Reddit"
  />
  <MenuLink
    icon={IconFacebook}
    href="https://facebook.com/DubPlusScript"
    text="Facebook"
  />
  <MenuLink
    icon={IconTwitter}
    href="https://twitter.com/DubPlusScript"
    text="Twitter"
  />
</MenuSection>
