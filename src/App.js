import React, { Component } from 'react';
import Team from './Team';
import AssistSpacer from './AssistSpacer';
import MonsterDialog from './MonsterDialog';
import './App.css';


class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			monsters: [[], [], [], []],
			monsterList: [],
			modalState: false
		};
	};

	currentSelection = { row: null, index: null	};

	render() {
		return (
		<div className="container">
			<div className="team">
				<Team
					row="0"
					monsters={this.state.monsters[0]}
					setslot={this.setSlot}
					setSelection={this.setSelection} />
				<AssistSpacer monsters={this.state.monsters[0]}/>
				<Team
					row="1"
					monsters={this.state.monsters[1]}
					setslot={this.setSlot}
					setSelection={this.setSelection} />
			</div>
			<div className="team">
				<Team
					row="2"
					monsters={this.state.monsters[2]}
					setslot={this.setSlot}
					setSelection={this.setSelection} />
					<AssistSpacer monsters={this.state.monsters[3]}/>
				<Team
					row="3"
					monsters={this.state.monsters[3]}
					setslot={this.setSlot}
					setSelection={this.setSelection} />
			</div>
			<MonsterDialog
				ids={this.state.ids}
				monsterList={this.state.monsterList}
				applySearch={this.applySearch}
				setSlot={this.setSlot}
				modalState={this.state.modalState}
				toggleModal={this.toggleModal} />
		</div>
		)
	}

	setSlot = (monster) => {
		console.debug(`Setting ${monster.name} @ ${this.currentSelection.row}, ${this.currentSelection.index}.`);
		let newMonsters = this.state.monsters;
		newMonsters[this.currentSelection.row][this.currentSelection.index] = monster;
		console.debug(`DEBUG: setting monster and toggling modal.`);
		this.setState((prevState, props) => ({
			monster: newMonsters,
			modalState: !prevState.modalState
		}));
	}
	
	toggleModal = () => {
		console.debug(`toggling modal`);
		this.setState((prevState, props) => ({
			modalState: !prevState.modalState
		}));
	}

	setSelection = (row, index) => {
		this.currentSelection.row = row;
		this.currentSelection.index = index;
		this.toggleModal();
		console.debug(`@ ${row}, ${index}.`);
	};

	getMonsterData() {
		let monsterUrl = '/static/monsters.json';

		fetch(monsterUrl)
			.then(response => response.json())
			.then((json) => {
				this.globalList = json.filter(monster => monster.max_level >= 99);
				this.setState({monsterList: this.globalList.slice(0,100)});
			})
			.then(() => {
				let ids = [
					[1746, 2012, 1619, 0, 0, 0],
					[3535, 2102, 3521, 2948, 2948, 0],
					[0, 2948, 2540, 2540, 2948, 2903],
					[0, 0, 2497, 998, 0, 2012]
				];

				let monsters = [
					[], [], [], []
				]

				ids.forEach((idArray, row) => {
					idArray.forEach((id, index) => {
						let temp = this.globalList.filter(
							(monster) => {
								return monster.id == id;
							})[0]
						
						if (temp) { monsters[row][index] = temp;
						} else { monsters[row][index] = null }
					});
				});
				
				this.setState({monsters: monsters});
			});
	}

	globalList = [];

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

	componentDidMount() {
		this.getMonsterData();		
	}

	componentDidUpdate() {
		console.debug(`Updated State: `, this.state);
	}
}
export default App;