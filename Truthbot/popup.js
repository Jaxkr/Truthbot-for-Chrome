var api_base_url = 'http://localhost:8000/api/';
var site_base_url = 'http://localhost:8000/';

function sendRequest(url, callback) {
	var request = new XMLHttpRequest();
	console.log('queried: ' + api_base_url + url);
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

var currentTabURL;
function init() {
	chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
		currentTabURL = tabs[0].url;
		queryAPI(currentTabURL)
	});
}

function queryAPI(currentTabURL) {
	sendRequest('orginfo/?url=' + encodeURIComponent(currentTabURL), displayPageInfo);}

function displayPageInfo(data) {
	if (data['status'] == 'success') {
		has_owner_data = true;
		console.log(data);
		var sentence = '<b>' + data['domain'] + '</b> is part of <b><a target="_blank" href="' + site_base_url + 'organizations/organization/' + data['organization'][0]['pk'] + '">' + data['organization'][0]['fields']['name'] + '</a></b>';
		for (var i = 0; i < data['parents'].length; i++) {
			sentence += ', which is owned by <b><a target="_blank" href="' + site_base_url + 'organizations/organization/' + data['parents'][i][0]['pk'] + '">' +  data['parents'][i][0]['fields']['name'] + '</a></b>';
		}
		sentence += '.'
		document.getElementById('ownership').innerHTML = sentence;
		document.getElementById('loadedcontent').style.display = 'block';
		document.getElementById('noownerinfo').style.display = 'none';
	} else if (data['status'] == 'notfound') {
		document.getElementById('noownerinfo').style.display = 'block';

	}
	document.getElementById('loadingowners').style.display = 'none';

}


document.addEventListener('DOMContentLoaded', init);
