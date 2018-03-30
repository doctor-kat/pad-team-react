import React, { Component } from 'react';

class AssistSpacer extends Component {
	render() {
		let elements = [];
		
		(this.props.ids).forEach((id, index) => {
			if (id) {
				elements.push(
					<div className="col-2 slot" key={index}>
						<i className="material-icons">arrow_downward</i>
						<i className="material-icons">arrow_upward</i>
					</div>
				);
			} else {
				elements.push(
					<div className="col-2 slot" key={index}></div>
				);
			}
		});

		return (
			<div className="row">
				{elements}
			</div>
		);
    }
}
export default AssistSpacer;