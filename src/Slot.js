import React, { Component } from 'react';

class Slot extends Component {
	render() {
		if (this.props.id != null) {
			const imgUrl = `/img/${this.props.id}.png`
			return (
				<a onClick={() => this.props.setSelection(this.props.row, this.props.index)}>
					<img src={imgUrl} alt={this.props.id} />
				</a>
			);
		};
		
		return null;
    }
}
export default Slot;