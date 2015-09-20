"use strict";

var EmployerDashboard = React.createClass({
	render: function () {
		return (
		<div>
			<SearchFields />
			<ResultsTable/>
		</div>
		);
	}
});

var SearchFields = React.createClass({
	// uncontrolled
	render: function () {
		return (
		<form id="student-search-fields" method="get">
			<label htmlFor="firstname">First Name</label>
			<input type="text" name="firstname" placeholder="First Name" /><br/>
			<label htmlFor="lastname">Last Name</label>
			<input type="text" name="lastname" placeholder="Last Name" /><br/>
			<label htmlFor="netid">NetID</label>
			<input type="text" name="netid" placeholder="NetID" /><br/>

			<label htmlFor="gradyear">Grad Year</label><br/>
			<input type="checkbox" name="gradyear[]" value="2015" /> 2015
			<input type="checkbox" name="gradyear[]" value="2016" /> 2016
			<input type="checkbox" name="gradyear[]" value="2017" /> 2017
			<input type="checkbox" name="gradyear[]" value="2018" /> 2018
			<input type="checkbox" name="gradyear[]" value="2019" /> 2019
			<br/>

			<label htmlFor="lookingfor">Looking for</label><br/>
			<input type="checkbox" name="lookingfor[]" value="fulltime" /> Fulltime
			<input type="checkbox" name="lookingfor[]" value="internship" /> Internship
			<br/>

			<label htmlFor="level">Level</label><br/>
			<input type="checkbox" name="level[]" value="undergrad" /> Undergraduate
			<input type="checkbox" name="level[]" value="masters" /> Master's
			<input type="checkbox" name="level[]" value="phd" /> PhD
			<br/>

			<input type="submit" value="Search" />
		</form>
		);
	}
});

var ResultsTable = React.createClass({
	render: function () {
		return (<p>yay</p>);
	}
});

React.render(<EmployerDashboard/>, document.getElementById('employer-dashboard'));
