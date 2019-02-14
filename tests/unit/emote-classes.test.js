import twitch from "@/utils/emotes/twitch-local";
import bttv from "@/utils/emotes/bttv-local";
import { emoji } from "@/utils/emotes/emoji";

describe("twitch emote tests", () => {
  test("Should get an emote from provided string", () => {
    let found = twitch.get("moon2SHRUG");
    expect(typeof found).toEqual("string");
    expect(found).toEqual(
      expect.stringContaining("static-cdn.jtvnw.net/emoticons")
    );
  });

  test("Should get null", () => {
    let found = twitch.get("notanemote");
    expect(found).toBeNull();
  });

  test("Should return an array of matches", () => {
    let matches = twitch.find("kap");
    expect(matches.length > 0).toBe(true);
    expect(matches[0].type).toEqual("twitch");
  });
});

describe("bttv emote tests", () => {
  test("Should get an emote from provided string", () => {
    let found = bttv.get("(puke)");
    expect(typeof found).toEqual("string");
    expect(found).toEqual(expect.stringContaining("cdn.betterttv.net/emote"));
  });

  test("Should get null", () => {
    let found = bttv.get("notanemote");
    expect(found).toBeNull();
  });

  test("Should return an array of matches", () => {
    let matches = bttv.find("btt");
    expect(matches.length > 0).toBe(true);
    expect(matches[0].type).toEqual("bttv");
  });
});

describe("emoji tests", () => {
  test("Should return an array of matches", () => {
    let matches = emoji.find("kis");
    expect(matches.length > 0).toBe(true);
    expect(matches[0].type).toEqual("emojify");
  });
});
