"use strict";

var EmployerDashboard = React.createClass({
	render: function () {
		return (
		<div>
			<SearchFields />
		</div>
		);
	}
});

var SearchFields = React.createClass({
	render: function () {
		return (
		<form name="student-search-fields">
			<label htmlFor="firstname">First Name</label>
			<input type="text" name="firstname" placeholder="First Name" /><br/>
			<label htmlFor="lastname">Last Name</label>
			<input type="text" name="lastname" placeholder="Last Name" /><br/>
			<label htmlFor="netid">NetID</label>
			<input type="text" name="netid" placeholder="NetID" /><br/>

			<label htmlFor="gradyear">Grad Year</label><br/>
			<input type="checkbox" name="gradyear" value="2015" /> 2015
			<input type="checkbox" name="gradyear" value="2016" /> 2016
			<input type="checkbox" name="gradyear" value="2017" /> 2017
			<input type="checkbox" name="gradyear" value="2018" /> 2018
			<input type="checkbox" name="gradyear" value="2019" /> 2019
			<br/>

			<label htmlFor="lookingfor">Looking for</label><br/>
			<input type="checkbox" name="lookingfor" value="fulltime" /> Fulltime
			<input type="checkbox" name="gradyear" value="internship" /> Internship
			<br/>

			<label htmlFor="level">Level</label><br/>
			<input type="checkbox" name="level" value="undergrad" /> Undergraduate
			<input type="checkbox" name="level" value="masters" /> Master's
			<input type="checkbox" name="level" value="phd" /> PhD
			<br/>
		</form>
		);
	}
});

React.render(<EmployerDashboard/>, document.getElementById('employer-dashboard'));
