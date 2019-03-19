Barnacle.js
===========


A basic Scorm Driver for launching and tracking SCORM 1.2 & 2004 content, build with Typescript.


Build
-----

	npm install
	npx webpack

The ES5 output will be compiled to /dist/Barnacle.js.

Configuration
-------------

The library uses Webpack to bundle, the default configuration is to target a `Barnacle` global variable. The script can be included using a script tag.

```html
	<script src="Barnacle.js"></script>
```

[Webpack configuration](https://webpack.js.org/configuration/output/) can be changed to support UMD or CommonJS [library targets](https://webpack.js.org/configuration/output/#outputlibrarytarget).


Initialising a new SCORM API
----------------------------


To init a new API construct a new `ScormDriver`

```javascript
	let driver = new Barnacle.ScormDriver(
				{ 
					onCommit: ( data, value ) => {} 
				},
				/* [SCORM 1.2 Factory function] */, 
				/* [SCORM 2004 Factory function] */ );
```
	
`options` parameter accepts a object with a callback function `onCommit ( state, version )`. This function will be called when new data is available via the API. See [SCORM runtime reference](https://scorm.com/scorm-explained/technical-scorm/run-time/run-time-reference/) for details of the values set in the data model.


`SCORM 1.2 factory function` and `SCORM 2004 factory function` parameters accepts a function to construct the implementation of the SCORM API. `( options: BarnacleOptions ) => UnifiedScormSignature`


Receiving SCORM commits
-----------------------

When the content commits changes to the data model, the `onCommit` handler will be called with the state and the version supplied as paramenters.

```javascript
	function onCommit ( state, version ) {

		console.log( state );
		// Will display an object containing the SCORM data model
		/*
		{
			"cmi.suspend_data"          :    "[124,252,358,469,121,254,322]",
			"cmi.completion_status"     :    "incomplete",
			"cmi.success_status"        :    "unknown"
		}
		*/

		console.log( version );
		// Will display the string value of the SCORM API version
		// "SCORM 1.2" or "SCORM 2004 4th Edition"
	}
```

Resuming SCORM Sessions
-----------------------

When you need to resume the session, call `load`

```javascript
```


API Reference
-------------

A `ScormDriver` has three methods available: 

Attach
---


	attach ( window )

The `ScormDriver` will create the required `API` and `API_1484_11` variable for communication with the content.

`window` - the window object you want to attach to. Required.

Load
---

	load ( state, version )

The `ScormDriver` will pre-populate the specified version with the state.

`state` - an object to load into the SCORM API, each property will be used to perform an `LMSSetValue` or `SetValue`. Required.

`version` - "SCORM 1.2" or "SCORM 2004 4th Edition". Required.

Launch
---

	launch ( url, newWindowName, openerWindow )

The `ScormDriver` will open the content in a new Window.

`url` - the url of the resource to open in the new browser window. Required.

`newWindowName` - the name for the new window. Default: `"course"`.

`openerWindow` - the window object that will open the new window. Default: `window`