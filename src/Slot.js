import React, { Component } from 'react';

class Slot extends Component {
	render() {
		if (this.props.monster != null) {
			const imgUrl = this.props.monster.image60_href
			return (
				<a onClick={() => this.props.setSelection(this.props.row, this.props.index)}>
					<img src={imgUrl} alt={this.props.monster.id} />
				</a>
			);
		};
		
		return null;
    }
}
export default Slot;