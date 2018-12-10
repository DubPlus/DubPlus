const options = require('../utils/options.js');

module.exports = {
  id : "dubplus-snow",
  moduleName : "Snow",
  description : "Make it snow!",
  category : "General",

  doSnow : function(){
    $(document).snowfall({
      round: true,
      shadow: true,
      flakeCount: 50,
      minSize: 1,
      maxSize: 5,
      minSpeed: 5,
      maxSpeed: 5
    });
  },

  turnOn : function() {
    if (!$.snowfall) {
      // only pull in the script once if it doesn't exist
      $.getScript( "https://cdn.jsdelivr.net/gh/loktar00/JQuery-Snowfall/src/snowfall.jquery.js" )
        .done(()=> {
          this.doSnow();
        })
        .fail(( jqxhr, settings, exception )=> {
          options.toggleAndSave(this.id, false);
          console.error('Could not load snowfall jquery plugin', exception);
        });
    } else {
      this.doSnow();
    }
  },

  turnOff : function(){
    if ($.snowfall) { 
      // checking to avoid errors if you quickly switch it on/off before plugin
      // is loaded in the turnOn function
      $(document).snowfall('clear');
    }
  }

};