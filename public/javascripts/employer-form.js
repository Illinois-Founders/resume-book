$(document).ready(function () {
	$(document).submit(function (e) { // #student-search-fields not triggering for some reason
		e.preventDefault();
		var formData = {};
		$.each($("#student-search-fields").serializeArray(), function (index, value) {
			if (value.value !== "") {
				formData[value.name] = value.value;
			}
		});
		console.log(formData);
		$.getJSON("/students/search?", formData, function (data) {
			console.log(data);
			// TODO: do something with data
		});
	});
});
