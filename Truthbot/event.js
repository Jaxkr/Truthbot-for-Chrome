chrome.browserAction.onClicked.addListener(function(tab) {
	var base_truthbot_url = 'http://www.truthbot.org/articles/article/';
	var url = base_truthbot_url + encodeURIComponent(tab.url);
	chrome.tabs.create({'url': url}, function(tab) {
	});
});
