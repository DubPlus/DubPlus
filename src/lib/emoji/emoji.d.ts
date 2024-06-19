export interface Emoji {
  /**
   * full image src url
   */
  src: string;

  /**
   * text for auto completion
   */
  text: string;

  /**
   * text for the alt and title tag
   */
  alt?: string;

  /**
   * platform where the emoji is from
   */
  platform: "twitch" | "bttv" | "ffz" | "tasty" | "emojify";
}