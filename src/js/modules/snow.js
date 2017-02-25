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

  // this function will be run on each click of the menu
  turnOff : function(){
    $(document).snowfall('clear');
  }

};