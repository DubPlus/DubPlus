import bttvSpriteSheet from './bttv-spritesheet';

const bttv = {
  get(name) {
    let emoteData = bttvSpriteSheet[name];
    if (emoteData) {
      return this.template(emoteData.id);
    }
    return null;
  },

  template(id) {
    return `//cdn.betterttv.net/emote/${id}/3x`;
  },

  /**
   * @param {string} symbol the emote name without the enclosing colons
   * @returns {array} an array of matches
   */
  find(symbol) {
    return Object.keys(bttvSpriteSheet)
      .filter(key => key.toLowerCase().indexOf(symbol.toLowerCase()) === 0)
      .map(name => {
        let obj = bttvSpriteSheet[name];
        obj.name = name;
        obj.type = "bttv";
        return obj;
      });
  }
};

export default bttv;