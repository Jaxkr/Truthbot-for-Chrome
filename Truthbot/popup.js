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
	var currentTabURL;
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
	var has_owner_data = false;
	var has_article_data = false;

	setInterval(function() {
		if (!has_owner_data) {
			queryAPI(currentTabURL);
		}
	}, 5000)
	setInterval(function() {
		if (!has_article_data) {
			queryAPI(currentTabURL);
		}
	}, 5000)
	function displayPageInfo(data) {
		if (data['status'] == 'success') {
			has_owner_data = true;
			var sentence = '<b>' + data['domain'] + '</b> is part of <b><a target="_blank" href="' + data['organization'][0]['fields']['wiki_url'] + '">' + data['organization'][0]['fields']['name'] + '</a></b>';
			for (var i = 0; i < data['parents'].length; i++) {
				if (data['parents'][i][0]['fields']['name'] == 'Comcast'){
					document.getElementById('comcastwarn').style.display = 'block';
				}
				console.log(data['parents'][i][0]['fields']['name']);
				if (data['parents'][i][0]['fields']['wiki_url'] !== '') {
					sentence += ', which is owned by <b><a target="_blank" href="' + data['parents'][i][0]['fields']['wiki_url'] + '">' +  data['parents'][i][0]['fields']['name'] + '</a></b>';
				} else {
					sentence += ', which is owned by <b>' + data['parents'][i][0]['fields']['name'] + '</b>'
				}


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

	function displayArticleInfo(data) {
		console.log(data);
		if (data['status'] == 'first') {
			document.getElementById('first').style.display = 'block';
		} else if (data['status'] == 'success') {
			has_article_data = true;
			document.getElementById('articletitle').innerHTML = data['article'][0]['fields']['title'];
			document.getElementById('pubdate').innerHTML = data['article'][0]['fields']['date'];
			if (!data['article'][0]['fields']['date']) {
				document.getElementById('date').style.display = 'none';
			}
			var keywords_string = '';
			var tags_object = JSON.parse(data['article'][0]['fields']['keywords']);
			var tags_object = tags_object.slice(0,6)
			for (var i = 0; i < tags_object.length; i++) {
				keywords_string += '<span class="label label-primary">' + tags_object[i] + '</span> ';
			}
			document.getElementById('keywords').innerHTML = keywords_string;
			var google_query_string = 'https://www.google.com/search?hl=en&tbm=nws&q=';
			for (var i = 0; i < tags_object.length; i++) {
				if (i != tags_object.length - 1) {
					google_query_string += tags_object[i] + '+';
				} else {
					google_query_string += tags_object[i];
				}
			}
			document.getElementById('first').style.display = 'none';
			document.getElementById('similararticles').href = google_query_string;
			document.getElementById('articleinfo').style.display = 'block';

		}
		document.getElementById('loadingarticle').style.display = 'none';
	}


	document.addEventListener('DOMContentLoaded', init);