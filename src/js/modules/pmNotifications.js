/* global Dubtrack */
import {notifyCheckPermission, showNotification} from '../utils/notify.js';

var myModule = {};
myModule.id = "dubplus_pm_notifications";
myModule.moduleName = "Notification on PM";
myModule.description = "Enable desktop notifications when a user receives a private message";
myModule.category = "General";

myModule.pmNotify = function(e){
  var userid = Dubtrack.session.get('_id');
  if (userid === e.userid) {return;}
  showNotification({
    title : 'You have a new PM', 
    ignoreActiveTab: true, 
    callback: function(){
      $('.user-messages').click();
      setTimeout(function(){
        $(`.message-item[data-messageid="${e.messageid}"]`).click();
      },500);
    },
    wait : 10000
  });
};

myModule.turnOn = function(){

  notifyCheckPermission((granted)=>{
    if (granted === true) {
      Dubtrack.Events.bind("realtime:new-message", this.pmNotify);
    } else {
      // turn back off until it's granted
      this.toggleAndSave(this.id, false);
    }
  });

};

myModule.turnOff = function() {
  Dubtrack.Events.unbind("realtime:new-message", this.pmNotify );
};

module.exports = myModule;