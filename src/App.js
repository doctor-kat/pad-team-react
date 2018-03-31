import React, { Component } from 'react';
import Team from './Team';
import AssistSpacer from './AssistSpacer';
import Modal from './Modal';
import './App.css';

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			ids: [
				[1746, 2012, 1619, 0, 0, 0],
				[3535, 2102, 3521, 2948, 2948, 0],
				[0, 2948, 2540, 2540, 2948, 2903],
				[0, 0, 2497, 998, 0, 2012]
			],
		};
	};

	currentSelection = { row: null, index: null	};

	render() {
		return (
		<div className="container">
			<div className="team">
				<Team
					row="0"
					ids={this.state.ids[0]}
					setId={this.setId}
					setSelection={this.setSelection} />
				<AssistSpacer ids={this.state.ids[0]}/>
				<Team
					row="1"
					ids={this.state.ids[1]}
					setId={this.setId}
					setSelection={this.setSelection} />
			</div>
			<div className="team">
				<Team
					row="2"
					ids={this.state.ids[2]}
					setId={this.setId}
					setSelection={this.setSelection} />
					<AssistSpacer ids={this.state.ids[3]}/>
				<Team
					row="3"
					ids={this.state.ids[3]}
					setId={this.setId}
					setSelection={this.setSelection} />
			</div>
			<Modal
				ids={this.state.ids}
				setId={this.setId} />
		</div>
		)
	}

	setId = (id) => {
		console.debug(`Set ${id} @ ${this.currentSelection.row}, ${this.currentSelection.index}.`);
		let newIds = this.state.ids;
		newIds[this.currentSelection.row][this.currentSelection.index] = id;
		this.setState((prevState, props) => ({
			ids: newIds
		}));
	}

	setSelection = (row, index) => {
		this.currentSelection.row = row;
		this.currentSelection.index = index;
		console.debug(`@ ${row}, ${index}.`);
	};

	componentDidUpdate() {
		console.debug(`Updated State: `, this.state);
	}
}
export default App;