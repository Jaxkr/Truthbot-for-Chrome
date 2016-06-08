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
	if (data['status'] == 'success') {
		var sentence = '<b>' + data['domain'] + '</b> is part of <b>' + data['organization'][0]['fields']['name'] + '</b>';
		for (var i = 0; i < data['parents'].length; i++) {
			console.log(data['parents'][i][0]['fields']['name']);
			sentence += ', which is owned by <b>' + data['parents'][i][0]['fields']['name'] + '</b>'
		}
		sentence += '.'
		document.getElementById('ownership').innerHTML = sentence;
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
		/*
		document.getElementById('articletitle').innerHTML = data['article'][0]['fields']['title'];
		document.getElementById('articlesummary').innerHTML = data['article'][0]['fields']['summary'];
		document.getElementById('keywords').innerHTML = data['article'][0]['fields']['keywords'];
		document.getElementById('articleinfo').style.display = 'block';
		*/
	}
	document.getElementById('loadingarticle').style.display = 'none';
}


document.addEventListener('DOMContentLoaded', init);