import React, { Component } from 'react';
import 'whatwg-fetch';

class Modal extends Component {
	constructor(props) {
		super(props);
		this.state = {
			monsterList: []
		}
	}

	globalList = [];

	getMonsterData() {
		let monsterUrl = 'https://www.padherder.com/api/monsters/';

		fetch(monsterUrl)
			.then(response => response.json())
			.then((json) => {
				this.globalList = json;
				this.setState((prevState, props) => ({
					monsterList: json.slice(0,100)
				}));
			});
	}

	componentDidMount() {
		this.getMonsterData();
	}

	componentDidUpdate() {
		console.debug(`State was updated.`);
	}

	applySearch = (e) => {
		let searchValue = e.target.value;
		console.debug(searchValue);
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
		this.setState((prevState, props) => ({
			monsterList: filteredList
		}));

		
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
			<div className="modal fade" id="picker" tabIndex="-1" role="dialog"
				aria-labelledby="monsterPicker" aria-hidden="true">
				<div className="modal-dialog" role="document">
					<div className="modal-content">
						<div className="modal-header">
							<input
								style={{width: '100%'}}
								onChange={this.applySearch} />
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