import React, { Component } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Button, Input } from 'reactstrap';
import 'whatwg-fetch';

class MonsterDialog extends Component {
	constructor(props) {
		super(props);
		this.state = {
			monsterList: []
		}
	}

	render() {
		let monsters = [];
		for (let monster of this.state.monsterList) {
			let imgUrl = 'https://www.padherder.com' + monster.image40_href;
			monsters.push(
				<a key={monster.id} onClick={(e) => this.props.setId(monster.id)}>
					<img src={imgUrl} alt={monster.id} />
				</a>
			);
		};

		return (
			<Modal
				isOpen={this.props.modalState}
				toggle={this.props.toggleModal}
				backdrop={true}>
				<ModalHeader toggle={this.props.toggleModal}>Monster Selection</ModalHeader>
				<ModalBody>
					<Input
						style={{width: '100%'}}
						onChange={this.applySearch} />
					{monsters}
				</ModalBody>
				<ModalFooter>
					<Button color="secondary" onClick={this.props.toggleModal}>Close</Button>
					<Button color="primary" onClick={this.props.toggleModal}>Save changes</Button>
				</ModalFooter>
			</Modal>
		);
	}

	globalList = [];
	
	getMonsterData() {
		let monsterUrl = 'https://www.padherder.com/api/monsters/';

		fetch(monsterUrl)
			.then(response => response.json())
			.then((json) => {
				this.globalList = json;
				this.setState({monsterList: json.slice(0,100)});
			});
	}

	componentDidMount() {
		this.getMonsterData();
	}

	shouldComponentUpdate(nextProps, nextState) {
		if (this.props.modalState && this.state.monsterList.length == nextState.monsterList.length) {
			return false;
		} else {
			return true;
		}
	}

	componentDidUpdate() {
		console.debug(`State was updated.`);
	}

	applySearch = (e) => {
		let searchValue = e.target.value;
		let filteredList = [];

		if (searchValue.length >= 2) {
				console.debug(`DEBUG: Searching for ${new RegExp(searchValue,"i")}`);
				filteredList = this.globalList.filter(
					(monster) => {
						return monster.name.match(new RegExp(searchValue,"i"));
					}
				)
			} /*else if ((this.currentAwakeningOptions.length > 0) && (this.searchValue.length < 2)) {
				console.debug("DEBUG: Search length < 2.")
				this.filteredList = this.globalList;
			} else {
				console.debug("DEBUG: Need at least one filter.");
			}*/

			/*if (filteredList) {
				// re-apply sorting/filters
				if (this.currentAwakeningOptions) {
					console.debug("DEBUG: Filtering by awakenings.")
					this.filteredList = this.filteredList.filterByAwakening(this.currentAwakeningOptions);
				}

				this.primaryAttributeFilter.forEach((enabled, attributeNumber) => {
					if (enabled) {
						this.filteredList = this.filteredList.filterByPrimaryAttribute(attributeNumber);
					}
				});
			
				// TODO: combine filterByAttribute functions together
				this.subAttributeFilter.forEach((enabled, attributeNumber) => {
					if (enabled) {
						this.filteredList = this.filteredList.filterBySubAttribute(attributeNumber);
					}
				});

				this.filteredList = this.filteredList.sortByStat(this.sortValue);*/

		console.debug(`DEBUG: found ${filteredList.length} results.`)
		this.setState({monsterList: filteredList});
	}

}
export default MonsterDialog;