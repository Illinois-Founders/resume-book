"use strict";

var EmployerTable = React.createClass({
	getInitialState: function(){
		return {results: []};
	},
	componentDidMount: function() {
		$.getJSON("/employers/all?", function (data) {
			this.setState({results: data});
		}.bind(this));
	},
	render: function() {
		return (
			<div>
				<ResultsTable results={this.state.results} />
			</div>
		);
	}
});

var ResultsRow = React.createClass({
	render: function () {
		var deleteLink = "/employers/delete/"+ this.props.employer.username
		return (
		<tr className="row panel panel-default">
			<td className="col-md-2">{this.props.employer.company_name}</td>
			<td className="col-md-2"> <a href={"mailto:" + this.props.employer.email}>{this.props.employer.email}</a></td>
			<td className="col-md-2">{this.props.employer.username}</td>
			<td className="col-md-2">{this.props.employer.created_at}</td>
			<td className="col-md-2"><a href={deleteLink}>Delete</a></td>
			</tr>
		);
	}
});

var ResultsTable = React.createClass({
	render: function () {
		var rows = [];
		this.props.results.forEach(function (data) {
			rows.push(<ResultsRow employer={data} />);
		});
		return (
		<table>
			<thead className="panel panel-default">
				<tr className="row">
					<th className="col-md-2">Company</th>
					<th className="col-md-2">Email</th>
					<th className="col-md-2">Username</th>
					<th className="col-md-2">Created on</th>
					<th className="col-md-2">Delete </th>
				</tr>
			</thead>
			<tbody>
				{rows}
			</tbody>
		</table>
		)
	}
});

React.render(<EmployerTable/>, document.getElementById('employer-table'))
