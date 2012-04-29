(function(global){
  var ce = global.ce = (function(ce){
    var isBackgroundPage = false,
      backgroundPage,
      lastFocusedNormalWindowId,
      exposedFunctions = {};

    /* Registers an object to be exposed on
    * the global object of all extension pages
    *
    * @param(string) exposee - The name of the object to be exposed
    * @param(object - optional) object - The object to be exposed. If this object is null
    *                 it will attempt to register a global object with
    *                 the name specified in the first parrameter.
    */
    var expose = function(exposee,object){
      if (isBackgroundPage || global.CEISTEST){
        if (typeof exposee === "string"){
          if (typeof object === "undefined" && !!global[exposee]){
            exposedFunctions[exposee] = global[exposee];
          } else {
            exposedFunctions[exposee] = object;
          }
        }
      }
    };

    //Adds exposed functions to the local global object
    var exposeBGFunctions = function(){
      if (typeof backgroundPage !== "undefined" && typeof backgroundPage.ce !== "undefined"){
        var bgExposedFunctions = backgroundPage.ce.getExposed();
        for (var prop in bgExposedFunctions){
          if (bgExposedFunctions.hasOwnProperty(prop)){
            if (typeof bgExposedFunctions[prop] === "function"){
              global[prop] = Function.prototype.bind.apply(bgExposedFunctions[prop],global);
            } else {
              global[prop] = bgExposedFunctions[prop];
            }
          }
        }
      }
    };

    //Returns the object containing the exposed objects
    var getExposed = function(){
      return exposedFunctions;
    };

    //searches the windows for the focused window of type "normal", then gets the active tab from the window.
    //Unfortunately, this functionality doesn't exist in the exposed chrome API
    var getActiveTab = function(callback){
      var activeTab;
      if (!lastFocusedNormalWindowId || lastFocusedNormalWindowId === -1){callback();return;}
      chrome.windows.get(lastFocusedNormalWindowId,{populate:true},function(focusedWindow){
        activeTab = _.find(focusedWindow.tabs,function(tab){
          return tab.active === true;
        });
        callback(activeTab);
      });
    };

    var init = function(){
      //make sure we are actually in an extension
      if (typeof chrome !== "undefined" && typeof chrome.extension !== "undefined"){
        backgroundPage = chrome.extension.getBackgroundPage();
        isBackgroundPage = backgroundPage === global;
        if (!isBackgroundPage){
          exposeBGFunctions();
        }
        bindListeners();
      }
    };

    var bindListeners = function(){
      trackLastFocusedNormalWindow();
    };

    var trackLastFocusedNormalWindow = function(){
	  //init the window id with the current window
      lastFocusedNormalWindowId = chrome.windows.WINDOW_ID_CURRENT;

      chrome.windows.onFocusChanged.addListener(function(windowId){
        if(!windowId || windowId === -1){return;}
        chrome.windows.get(windowId,function(windowObj){
          if (windowObj && typeof windowObj.type === "string" && windowObj.type === "normal"){
            lastFocusedNormalWindowId = windowId;
          }
        });
      });
    };

    init();
    return {
      expose : expose,
      getExposed : getExposed,
      getActiveTab : getActiveTab
    };
  }(ce));
}(this)); //not that this could be used anywhere but a chrome extension...