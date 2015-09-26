var getStats = function(event) {
	event.preventDefault();

	var username = $('#username').val();
	var base_url = "https://api.github.com/";
	var repos_url = base_url + "users/" + username + "/repos";

	$.ajax({
		url: repos_url,
		data: "",
		success: getLanguages,
		error: handleError,
		dataType: "json"
	});

}

function getLanguages(response) {
	for (var i = 0; i < response.length; i++) {
		$.get(response[i].languages_url, updateStats);
	}
}

function handleError(xhr, code_status, error) {
	console.log(error);
}


var languages = {};

function updateStats(response) {
	for (var property in response) {
    if (response.hasOwnProperty(property)) {
    	if (languages[property] === undefined) {
      	languages[property] = response[property];  
    	} else {
      	languages[property] += response[property];  
    	}
    }
	}
	console.log(languages)
}

function displayStats() {
	var total_bytes = 0;
	for (var language in languages) {
		if (languages.hasOwnProperty(language)) {
			total_bytes += languages[language];
		}
	}
	$("div").append("<p>Total bytes: " + total_bytes + "</p>");
}

$('form').on('submit', getStats);