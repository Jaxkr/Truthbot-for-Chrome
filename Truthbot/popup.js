var api_base_url = 'http://localhost:8000/api/';
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

function init() {
	chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
		currentTabURL = tabs[0].url;
		queryAPI(currentTabURL)
	});
}

function queryAPI(currentTabURL) {
	sendRequest('getownerinfo/?url=' + encodeURIComponent(currentTabURL), displayPageInfo);
	sendRequest('getarticleinfo/?url=' + encodeURIComponent(currentTabURL), displayArticleInfo);
}

function displayPageInfo(data) {
	console.log(data);
	if (data['status'] == 'success') {
		var ownership_sentence = '<b>' + data['domain'] + '</b> is part of <b>' + data['organization'][0]['fields']['name'] + '</b>';
		if (data['parent_organizations'].length > 0) {
			ownership_sentence += ' which is owned by <b>' + data['parent_organizations'][0]['fields']['name'] + '</b>.'
		}
		document.getElementById('ownership').innerHTML = ownership_sentence;
		document.getElementById('loadedcontent').style.display = 'block';
	} else if (data['status'] == 'notfound') {
		document.getElementById('noownerinfo').style.display = 'block';

	}
	document.getElementById('loadingowners').style.display = 'none';

}

function displayArticleInfo(data) {
	console.log(data);
	if (data['status'] == 'first') {
		document.getElementById('first').style.display = 'block';
	} else if (data['status'] == 'success') {
		document.getElementById('articletitle').innerHTML = data['article'][0]['fields']['title'];
		document.getElementById('articlesummary').innerHTML = data['article'][0]['fields']['summary'];
		document.getElementById('keywords').innerHTML = data['article'][0]['fields']['keywords'];
		document.getElementById('articleinfo').style.display = 'block';
	}
	document.getElementById('loadingarticle').style.display = 'none';
}


document.addEventListener('DOMContentLoaded', init);