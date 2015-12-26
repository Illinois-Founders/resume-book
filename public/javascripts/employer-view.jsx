"use strict";

var EmployerDashboard = React.createClass({
	getInitialState: function () {
		return {results: []};
	},
	componentDidMount: function(){
		console.log('running component did mount');
	},
	completeSearch: function (data) {
		this.setState({results: data});
	},
	render: function () {
		var toRender; 
		if (this.state.results.length > 0){
			toRender = <ResultsTable results={this.state.results} />;
		}
		else {
			toRender = <div className="center-text"> <h3> No results to show yet. Try a search! </h3></div>;
		}

		return (
		<div>
			<SearchFields onCompleteSearch={this.completeSearch} />
			{toRender}
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

		console.log('running handle submit');

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

		var major = [];
		Object.keys(majorDict).forEach(function (m) {
			if (this.state[m]) major.push(m);
		}.bind(this));
		if (major.length > 0) formData.major = major;

		var seeking = [];
		if (this.state.fulltime) seeking.push("fulltime");
		if (this.state.internship) seeking.push("internship");
		if (seeking.length > 0) formData.seeking = seeking;

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
			<div className="panel panel-primary search-fields">
				<div className="panel-body">
					<h4> Search By: </h4>
					<div className="search-field">
						<label htmlFor="firstname">First Name</label>
						<input type="text" name="firstname" placeholder="First Name" valueLink={this.linkState('firstname')} /><br/>
						<label htmlFor="lastname">Last Name</label>
						<input type="text" name="lastname" placeholder="Last Name" valueLink={this.linkState('lastname')} /><br/>
						<label htmlFor="netid">NetID</label>
						<input type="text" name="netid" placeholder="NetID" valueLink={this.linkState('netid')} /><br/>
					</div>

					<div className="search-field">
						<label htmlFor="gradyear">Graduation Year</label><br/>
						<input type="checkbox" name="gradyear[]" value="2015" checkedLink={this.linkState('gradyear2015')} /> 2015
						<input type="checkbox" name="gradyear[]" value="2016" checkedLink={this.linkState('gradyear2016')} /> 2016
						<input type="checkbox" name="gradyear[]" value="2017" checkedLink={this.linkState('gradyear2017')} /> 2017
						<input type="checkbox" name="gradyear[]" value="2018" checkedLink={this.linkState('gradyear2018')} /> 2018
						<input type="checkbox" name="gradyear[]" value="2019" checkedLink={this.linkState('gradyear2019')} /> 2019
					</div>

					<div className="search-field">
						<label htmlFor="major">Major</label><br/>
						<input type="checkbox" name="major[]" value="cs" checkedLink={this.linkState('cs')} /> Computer Science
						<input type="checkbox" name="major[]" value="ce" checkedLink={this.linkState('ce')} /> Computer Engineering
						<input type="checkbox" name="major[]" value="ee" checkedLink={this.linkState('ee')} /> Electrial Engineering
						<input type="checkbox" name="major[]" value="ae" checkedLink={this.linkState('ae')} /> Aerospace Engineering
						<input type="checkbox" name="major[]" value="age" checkedLink={this.linkState('age')} /> Agricultural Engineering
						<input type="checkbox" name="major[]" value="bioe" checkedLink={this.linkState('bioe')} /> Bioengineering
						<input type="checkbox" name="major[]" value="chem" checkedLink={this.linkState('chem')} /> Chemical Engineering
						<input type="checkbox" name="major[]" value="cive" checkedLink={this.linkState('cive')} /> Civil Engineering
						<input type="checkbox" name="major[]" value="phys" checkedLink={this.linkState('phys')} /> Engineering Physics
						<input type="checkbox" name="major[]" value="ge" checkedLink={this.linkState('ge')} /> General Engineering
						<input type="checkbox" name="major[]" value="ie" checkedLink={this.linkState('ie')} /> Industrial Engineering
						<input type="checkbox" name="major[]" value="matse" checkedLink={this.linkState('matse')} /> Materials Science and Engineering
						<input type="checkbox" name="major[]" value="me" checkedLink={this.linkState('me')} /> Mechanical Engineering
						<input type="checkbox" name="major[]" value="npre" checkedLink={this.linkState('npre')} /> Nuclear Engineering
						<input type="checkbox" name="major[]" value="noneng" checkedLink={this.linkState('noneng')} /> Other Major
					</div>

					<div className="search-field">
						<label htmlFor="level">Level</label><br/>
						<input type="checkbox" name="level[]" value="undergrad" checkedLink={this.linkState('undergrad')} /> Undergraduate
						<input type="checkbox" name="level[]" value="masters" checkedLink={this.linkState('masters')} /> Masters
						<input type="checkbox" name="level[]" value="phd" checkedLink={this.linkState('phd')} /> PhD
					</div>

					<div className="search-field">
						<label htmlFor="seeking">Seeking</label><br/>
						<input type="checkbox" name="seeking[]" value="fulltime" checkedLink={this.linkState('fulltime')} /> Fulltime
						<input type="checkbox" name="seeking[]" value="internship" checkedLink={this.linkState('internship')} /> Internship
					</div>

					<div className="search-field">
						<label htmlFor="sortby">Sort by</label>
						<select name="sortby" valueLink={this.linkState('sortby')}>
							<option value="none">None</option>
							<option value="firstname">Firstname</option>
							<option value="lastname">Lastname</option>
							<option value="netid">Email/NetID</option>
							<option value="gradyear">Grad Year</option>
							<option value="major">Major</option>
							<option value="seeking">Looking for</option>
							<option value="level">Level</option>
						</select>

						<label htmlFor="sortorder">Sort order</label>
						<select name="sortorder" valueLink={this.linkState('sortorder')}>
							<option value="">Ascending</option>
							<option value="-">Descending</option>
						</select>
					</div>

					<input type="submit" value="Search" />
				</div>
			</div>
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

var majorDict = {
	"cs": "Computer Science",
	"ce": "Computer Engineering",
	"ee": "Electrical Engineering",
	"ae": "Aerospace Engineering",
	"age": "Agricultural Engineering",
	"bioe": "Bioengineering",
	"chem": "Chemical Engineering",
	"cive": "Civil Engineering",
	"phys": "Engineering Physics",
	"ge": "General Engineering",
	"ie": "Industrial Engineering",
	"matse": "Materials Science and Engineering",
	"me": "Mechanical Engineering",
	"npre": "Nuclear Engineering",
	"noneng": "Other Major"
};

var ResultsRow = React.createClass({
	render: function () {
		var email = this.props.student.netid + "@illinois.edu";
		var resumeLink = "https://founders-resumes.s3.amazonaws.com/" + this.props.student.netid + ".pdf";
		var seeking = seekingDict[this.props.student.seeking] || this.props.student.seeking;
		var level = levelDict[this.props.student.level] || this.props.student.level;
		var major = majorDict[this.props.student.major] || this.props.student.major;
		return (
		<tr className="row panel panel-default">
			<td className="col-md-2">{this.props.student.firstname} {this.props.student.lastname}</td>
			<td className="col-md-2"> <a href={"mailto:" + email}>{email}</a></td>
			<td className="col-md-2">{seeking}</td>
			<td className="col-md-2">{this.props.student.gradyear}</td>
			<td className="col-md-2">{level}</td>
			<td className="col-md-2">{major}</td>
			<td className="col-md-2"><a target="_blank" href={resumeLink}><i className="fa fa-external-link"></i></a></td>
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
			<thead className="panel panel-default">
				<tr className="row">
					<th className="col-md-2">Name</th>
					<th className="col-md-2">Email</th>
					<th className="col-md-2">Seeking</th>
					<th className="col-md-2">Grad Year</th>
					<th className="col-md-2">Level</th>
					<th className="col-md-2">Major</th>
					<th className="col-md-2">Link to Resume</th>
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
