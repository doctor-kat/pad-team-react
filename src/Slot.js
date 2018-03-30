import React, { Component } from 'react';

class Slot extends Component {
	render() {
		if (this.props.id) {
			const imgUrl = `/img/${this.props.id}.png`
			return (
				<a data-toggle="modal" data-target="#picker">
					<img src={imgUrl} alt={this.props.id} />
				</a>
			);
		};
		
		return null;
    }
}
export default Slot;