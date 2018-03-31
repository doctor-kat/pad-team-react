import React, { Component } from 'react';
import Slot from './Slot';

class Team extends Component {
	render() {
        let slots = [];
        (this.props.ids).forEach((id, index) => {
			slots.push(
                <div className="col-2 slot" key={index}>
					<Slot
                        id={id}
                        row={this.props.row}
                        index={index}
                        setId={this.props.setId}
                        setSelection={this.props.setSelection} />
				</div>
            );
		});
		
        return (
            <div className="row">
                {slots}
            </div>
        );
    }
}
export default Team;