import React, { Component } from 'react';
import Team from './Team';
import AssistSpacer from './AssistSpacer';
import Modal from './Modal';
import './App.css';

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			ids: {
				a_assists: [1746, 2012, 1619, null, null, null],
				a_subs: [3535, 2102, 3521, 2948, 2948, null],
				b_subs: [null, 2948, 2540, 2540, 2948, 2903],
				b_assists: [null, null, 2497, 998, null, 2012]
			},
			currentSlot: null
		};
	};

	render() {
		return (
		<div className="container">
			<div className="team">
				<Team id="a" type="assist" ids={this.state.ids.a_assists} />
				<AssistSpacer ids={this.state.ids.a_assists}/>
				<Team id="a" type="sub" ids={this.state.ids.a_subs} />
			</div>
			<div className="team">
				<Team id="b" type="sub" ids={this.state.ids.b_subs} />
				<AssistSpacer ids={this.state.ids.b_assists}/>
				<Team id="b" type="assist" ids={this.state.ids.b_assists}/>
			</div>
			<Modal ids={this.state.ids} handleChange={this.handleChange}/>
		</div>
		)
	}

	setId()

	handleChange = (e) => {
		let value = e.target.value
		this.setState((prevState, props) => ({
			sample: value
		}));
	}

	componentDidUpdate() {
		console.log(this.state);
	}
}
export default App;