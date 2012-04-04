# ce.js

A simple Chrome extension javascript helper library.

## Usage

To use, just include a reference to ce.js (or ce-min.js) on all your extension pages.

For example:
    <script src="/js/lib/ce-min.js"></script>

## Functions

### ce.expose(name,object)
Exposes an object defined on the background page to all extension pages. To use, just pass the name you want the object exposed as, and the object. Or, if you pass just a name, it will attempt to expose an object from the global scope with that name.

    //in background.html
    localStorage["myData"] = "yourData";

    var dataAccess = {
        getData : function(){
            return localStorage["myData"];
        }
    };
    ce.expose("dataAccess");
    ce.expose("dataAccessDuplicate",dataAccess);
    
    
    //in popup.html
    console.log(dataAccess.getData()); //"yourData"
    console.log(dataAccessDuplicate.getData()); //"yourData"

An interesting feature to note is if you reference an object in a background function you are exposing, it will be closurized and referenced by the pages that use the exposed function. For example:

    //in background.html

    var globalReference = function(){
    	//actually calling window.console.log
    	console.log("Where will I end up?");
    };
    ce.expose("globalReference");

    //in popup.html
    globalReference();

    //in background.html's console window: "Where will I end up?"

## TODO
* add parameter to expose to force "this" to be bound to local global scope rather than the bg page global scope
* add method for broadcasting information to every extension page from any extension page

## License

MIT License --> 

Copyright (c) 2012 Ben Bright

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.