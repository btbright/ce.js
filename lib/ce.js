(function(global){
	var ce = global.ce = (function(ce){
		var isBackgroundPage = false,
			backgroundPage,
			exposedFunctions = {};

		/* Registers an object to be exposed on
		* the global object of all extension pages
		*
		* @param(string) exposee - The name of the object to be exposed
		* @param(object - optional) object - The object to be exposed. If this object is null
		*									it will attempt to register a global object with
		*									the name specified in the first parrameter.
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
						global[prop] = bgExposedFunctions[prop];
					}
				}
			}
		};

		//Returns the object containing the exposed objects
		var getExposed = function(){
			return exposedFunctions;
		};

		var init = function(){
			//make sure we are actually in an extension
			if (typeof chrome !== "undefined" && typeof chrome.extension !== "undefined"){
				backgroundPage = chrome.extension.getBackgroundPage();
				isBackgroundPage = backgroundPage === global;
				if (!isBackgroundPage){
					exposeBGFunctions();
				}
			}
		};

		init();
		return {
			expose : expose,
			getExposed : getExposed
		};
	}(ce));
}(this)); //not that this could be used anywhere but a chrome extension...