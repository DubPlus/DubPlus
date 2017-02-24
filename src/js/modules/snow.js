var menu = require('../lib/menu.js');

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
  start : function() {
    if (!$.snowfall) {
      // only pull in the script once if it doesn't exist
      $.getScript( "https://rawgit.com/loktar00/JQuery-Snowfall/master/src/snowfall.jquery.js" )
        .done(()=> {
          this.doSnow();
        })
        .fail(function( jqxhr, settings, exception ) {
          console.error('Could not load snowfall jquery plugin', exception);
        });
    } else {
      this.doSnow();
    }
  },

  init : function() {
    if (this.optionState) {
      this.start() ;
    }
  },

  // this function will be run on each click of the menu
  go : function(e){
    var newOptionState;

    if (!this.optionState) {
      newOptionState = true;
      this.start();
    } else {
      newOptionState= false;
      $(document).snowfall('clear');
    }

    this.optionState = newOptionState;
    this.toggleAndSave(this.id, newOptionState);
  }

};