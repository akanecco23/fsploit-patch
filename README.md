# fsploit patch

fsploit is a 3rd-party hack client created by [@mahdi13377](https://github.com/mahdi13377) for the browser game [Deeeep.io](https://deeeep.io). 

## Potential patch

The following code can be executed at any time, preferably after the user has successfully joined a game server. 

```js
// first, make a backup of the original Error.stackTraceLimit
const lim = Error.stackTraceLimit;

Error.stackTraceLimit = 1;

// function to be executed if a game object injector is present
function detected() {
	// this is just fancy styling for the console message
	console.log(
		"%cGame object injector detected!",
		"font-family:quicksand;font-weight:bold;color:white;font-size:125%;background:#f00;padding:4px 12px 4px 8px;border-radius:0 16px 16px 0;border-left:8px #800 solid"
	);

	// do something to ban the user
	// ...
}

// force trigger an error
function triggerError() {
	""();
}
try {
	triggerError.call(Function.prototype.bind);

	// trigger the detection function if an error is NOT thrown
	// if the code above didn't cause and error and stop this code then it would mean that the client is tampering with the error handling
	detected();
} catch (error) {
	// trigger the detection function if a function proxy is present in the stack trace
	if (error.stack.includes("Proxy")) {
		detected();
	}
}

// restore the original Error.stackTraceLimit
Error.stackTraceLimit = lim;

```
