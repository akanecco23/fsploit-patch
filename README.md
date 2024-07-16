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

## Miscellaneous shenanigans

### Determining if a credential logger is present (July 15, 2024)
You can determine whether the fsploit version you are currently using is safe or not by running the following code in the browser console.

```js
(() => {
    const lim = Error.stackTraceLimit;
    Error.stackTraceLimit = 1;
    try {
        (() => ""()).call(XMLHttpRequest.bind);
        return true;
    } catch (error) {
        Error.stackTraceLimit = lim;
        if (error.stack.includes("Proxy")) {
            return true;
        }
        return false;
    }
})();
```

This new method of credential logging uses a proxy function binded to a hook on the XMLHttpRequest constructor to intercept requests.

If the code returns true, it means your requests are being intercepted by a potentially malicious script. 

### (OUTDATED!) Determining if a credential logger is present (July 14, 2024)

```js
XMLHttpRequest.prototype.open.toString() !== "function open() { [native code] }"
```

This is the original credential logging method. It relies on modifying the XMLHttpRequest.open function to intercept requests. 

For more information about how the credential logger works, see [`files/xhr hook.js`](https://github.com/akanecco23/fsploit-patch/blob/main/files/xhr%20hook.js). This has the deobfuscated version of the credential logger used in fsploit. It has been taken directly from fsploit's obfuscated code.
![Obfuscated fsploit credential logger](https://github.com/user-attachments/assets/95cb20be-7b93-4e53-9eed-53088317f341)

### Restoring console.log()
fsploit nullifies console.log() in order to make it harder to deobfuscate its code. You can restore console.log() by running the following code in the browser console.

```js
(() => {
    const i = document.createElement("iframe");
    i.style.display = "none";
    document.body.appendChild(i);
    window.console = i.contentWindow.console
})();
```
