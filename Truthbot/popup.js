var api_base_url = 'http://localhost:8000/api/';

function sendRequest(url, callback) {
	var request = new XMLHttpRequest();
	request.open('GET', api_base_url + url, true);

	request.onload = function() {
		if (this.status >= 200 && this.status < 400) {
			returnJSON = JSON.parse(this.response)
			callback(returnJSON)
		} else {
		    // We reached our target server, but it returned an error

		}
	};

	request.onerror = function() {
		  // There was a connection error of some sort
		};

	request.send();
}

function init() {
	chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
		currentTabURL = tabs[0].url;
		queryAPI(currentTabURL)
	});
}

function queryAPI(currentTabURL) {
	sendRequest('getsiteinfo/?domain=' + encodeURIComponent(currentTabURL), displayPageInfo);
}

function displayPageInfo(data) {
	document.write(data['asdf'])
}


document.addEventListener('DOMContentLoaded', init);