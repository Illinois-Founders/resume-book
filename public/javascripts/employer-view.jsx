"use strict";

var EmployerDashboard = React.createClass({
	getInitialState: function () {
		return {results: []};
	},
	completeSearch: function (data) {
		this.setState({results: data});
	},
	render: function () {
		return (
		<div>
			<SearchFields onCompleteSearch={this.completeSearch} />
			<ResultsTable results={this.state.results} />
		</div>
		);
	}
});

var SearchFields = React.createClass({
	mixins: [React.addons.LinkedStateMixin],
	getInitialState: function () {
		return {
			firstname: "",
			lastname: "",
			netid: "",
			sortby: "none",
			sortorder: ""
		};
	},
	handleSubmit: function (e) {
		e.preventDefault();

		// get relevant form data
		var formData = {};

		if (this.state.firstname) formData.firstname = this.state.firstname;
		if (this.state.lastname) formData.lastname = this.state.lastname;
		if (this.state.netid) formData.netid = this.state.netid;

		var gradyear = [];
		for (var year = 2015; year <= 2019; year++) {
			if (this.state["gradyear" + year]) gradyear.push(year);
		}
		if (gradyear.length > 0) formData.gradyear = gradyear;

		var lookingfor = [];
		if (this.state.fulltime) lookingfor.push("fulltime");
		if (this.state.internship) lookingfor.push("internship");
		if (lookingfor.length > 0) formData.lookingfor = lookingfor;

		var level = [];
		if (this.state.undergrad) level.push("undergrad");
		if (this.state.masters) level.push("masters");
		if (this.state.phd) level.push("phd");
		if (level.length > 0) formData.level = level;

		if (this.state.sortby != "none") {
			formData.sort = this.state.sortorder + this.state.sortby;
		}

		// call API
		$.getJSON("/students/search?", formData, function (data) {
			this.props.onCompleteSearch(data);
		}.bind(this));
	},
	render: function () {
		return (
		<form id="student-search-fields" method="get" onSubmit={this.handleSubmit}>
			<label htmlFor="firstname">First Name</label>
			<input type="text" name="firstname" placeholder="First Name" valueLink={this.linkState('firstname')} /><br/>
			<label htmlFor="lastname">Last Name</label>
			<input type="text" name="lastname" placeholder="Last Name" valueLink={this.linkState('lastname')} /><br/>
			<label htmlFor="netid">NetID</label>
			<input type="text" name="netid" placeholder="NetID" valueLink={this.linkState('netid')} /><br/>

			<label htmlFor="gradyear">Grad Year</label><br/>
			<input type="checkbox" name="gradyear[]" value="2015" checkedLink={this.linkState('gradyear2015')} /> 2015
			<input type="checkbox" name="gradyear[]" value="2016" checkedLink={this.linkState('gradyear2016')} /> 2016
			<input type="checkbox" name="gradyear[]" value="2017" checkedLink={this.linkState('gradyear2017')} /> 2017
			<input type="checkbox" name="gradyear[]" value="2018" checkedLink={this.linkState('gradyear2018')} /> 2018
			<input type="checkbox" name="gradyear[]" value="2019" checkedLink={this.linkState('gradyear2019')} /> 2019
			<br/>

			<label htmlFor="lookingfor">Looking for</label><br/>
			<input type="checkbox" name="lookingfor[]" value="fulltime" checkedLink={this.linkState('fulltime')} /> Fulltime
			<input type="checkbox" name="lookingfor[]" value="internship" checkedLink={this.linkState('internship')} /> Internship
			<br/>

			<label htmlFor="level">Level</label><br/>
			<input type="checkbox" name="level[]" value="undergrad" checkedLink={this.linkState('undergrad')} /> Undergraduate
			<input type="checkbox" name="level[]" value="masters" checkedLink={this.linkState('masters')} /> Master's
			<input type="checkbox" name="level[]" value="phd" checkedLink={this.linkState('phd')} /> PhD
			<br/>

			<label htmlFor="sortby">Sort by</label>
			<select name="sortby" valueLink={this.linkState('sortby')}>
				<option value="none">None</option>
				<option value="firstname">Firstname</option>
				<option value="lastname">Lastname</option>
				<option value="netid">Email/NetID</option>
				<option value="gradyear">Grad Year</option>
				<option value="seeking">Looking for</option>
				<option value="level">Level</option>
			</select>

			<label htmlFor="sortorder">Sort order</label>
			<select name="sortorder" valueLink={this.linkState('sortorder')}>
				<option value="">Ascending</option>
				<option value="-">Descending</option>
			</select>

			<input type="submit" value="Search" />
		</form>
		);
	}
});

var seekingDict = {
	"fulltime": "Full Time",
	"internship": "Internship"
};

var levelDict = {
	"undergrad": "Undergraduate",
	"masters": "Master's",
	"phd": "PhD"
};

var ResultsRow = React.createClass({
	render: function () {
		var email = this.props.student.netid + "@illinois.edu";
		var resumeLink = "https://founders-resumes.s3.amazonaws.com/" + this.props.student.netid + ".pdf";
		var seeking = seekingDict[this.props.student.seeking] || this.props.student.seeking;
		var level = levelDict[this.props.student.level] || this.props.student.level;
		return (
		<tr>
			<td>{this.props.student.firstname} {this.props.student.lastname}</td>
			<td><a href={"mailto:" + email}>{email}</a></td>
			<td>{seeking}</td>
			<td>{this.props.student.gradyear}</td>
			<td>{level}</td>
			<td><a href={resumeLink}><i className="fa fa-external-link"></i></a></td>
		</tr>
		);
	}
});

var ResultsTable = React.createClass({
	render: function () {
		var rows = [];
		this.props.results.forEach(function (student) {
			rows.push(<ResultsRow student={student} />);
		});
		return (
		<table>
			<thead>
				<tr>
					<th>Name</th>
					<th>Email</th>
					<th>Seeking</th>
					<th>Grad Year</th>
					<th>Level</th>
					<th>Link to Resume</th>
				</tr>
			</thead>
			<tbody>
				{rows}
			</tbody>
		</table>
		);
	}
});

React.render(<EmployerDashboard/>, document.getElementById('employer-dashboard'));
