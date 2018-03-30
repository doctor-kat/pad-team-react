import React, { Component } from 'react';
import 'whatwg-fetch';

class Modal extends Component {
	constructor(props) {
		super(props);
		this.state = {
			monsterList: []
		}
	}
	
	handleChange(e) {

	}

	getMonsterData() {
		let monsterUrl = 'https://www.padherder.com/api/monsters/';

		fetch(monsterUrl)
			.then(response => response.json())
			.then((json) => {
				this.setState((prevState, props) => ({
					monsterList: json.slice(2000,2050)
				}));
			});
	}

	componentDidMount() {
		this.getMonsterData();
	}

	componentDidUpdate() {
		// console.log(this.state);
		console.log(`State was updated.`);
	}

	selectMonster(id) {
		console.log(`id ${id}.`);
	}
	
	render() {
		let monsters = [];

		for (let monster of this.state.monsterList) {
			let imgUrl = 'https://www.padherder.com' + monster.image40_href;
			monsters.push(
				<a key={monster.id} onClick={(e) => this.selectMonster(monster.id)}>
					<img src={imgUrl} alt={monster.id} />
				</a>
			);
		};

		return (
			<div className="modal fade" id="picker" tabIndex="-1" role="dialog"
				aria-labelledby="monsterPicker" aria-hidden="true">
				<div className="modal-dialog" role="document">
					<div className="modal-content">
						<div className="modal-header">
							<input
								style={{width: '100%'}}
								onChange={this.handleChange} />
							<button type="button" className="close" data-dismiss="modal" aria-label="Close">
								<span aria-hidden="true">&times;</span>
							</button>
						</div>
						<div className="modal-body">
							{monsters}
						</div>
						<div className="modal-footer">
							<button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
							<button type="button" className="btn btn-primary">Save changes</button>
						</div>
					</div>
				</div>
			</div>
		);
	}
}
export default Modal;