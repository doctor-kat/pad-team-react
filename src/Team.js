import React, { Component } from 'react';
import Slot from './Slot';

class Team extends Component {
	render() {
        let slots = [];
        (this.props.monsters).forEach((monster, index) => {
			slots.push(
                <div className="col-2 slot" key={index}>
					<Slot
                        monster={monster}
                        row={this.props.row}
                        index={index}
                        setSlot={this.props.setSlot}
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