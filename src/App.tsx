import * as React from 'react';
import Team from './Team';
import { Monster } from './Monster';
import { Awakening } from './Awakening';
import './Monster-Array';
import AssistSpacer from './AssistSpacer';
import MonsterDialog from './MonsterDialog';
import './App.css';

type State = {
    monsters: [Monster[], Monster[], Monster[], Monster[]],
    monsterList: Monster[],
    awakeningList: Awakening[],
    modalState: boolean
};

class App extends React.Component<{}, State> {
    currentSelection = { row: 0, index: 0 };
    globalList: Monster[] = [];
    allAwakenings: Awakening[] = [];
    searchValue: string = ``;

    constructor(props: {}) {
        super(props);
        this.state = {
            monsters: [[], [], [], []],
            monsterList: [],
            awakeningList: [],
            modalState: false
        };
    }

    render() {
        return (
            <div className="container">
                <div className="team">
                    <Team
                        row={0}
                        monsters={this.state.monsters[0]}
                        setSlot={this.setSlot}
                        setSelection={this.setSelection}
                    />
                    <AssistSpacer monsters={this.state.monsters[0]}/>
                    <Team
                        row={1}
                        monsters={this.state.monsters[1]}
                        setSlot={this.setSlot}
                        setSelection={this.setSelection}
                    />
                </div>
                <div className="team">
                    <Team
                        row={2}
                        monsters={this.state.monsters[2]}
                        setSlot={this.setSlot}
                        setSelection={this.setSelection}
                    />
                    <AssistSpacer monsters={this.state.monsters[3]}/>
                    <Team
                        row={3}
                        monsters={this.state.monsters[3]}
                        setSlot={this.setSlot}
                        setSelection={this.setSelection}
                    />
                </div>
                <MonsterDialog
                    monsters={this.state.monsters}
                    monsterList={this.state.monsterList}
                    awakenings={this.state.awakeningList}
                    allAwakenings={this.allAwakenings}
                    applySearch={this.applySearch}
                    setSlot={this.setSlot}
                    addAwakening={this.addAwakening}
                    removeAwakening={this.removeAwakening}
                    modalState={this.state.modalState}
                    toggleModal={this.toggleModal}
                />
            </div>
        );
    }

    // ==============
    // DATA FUNCTIONS
    // ==============

    getMonsterData() {
        let monsterUrl = '/static/monsters.json';

        fetch(monsterUrl)
        .then(response => response.json())
        .then((json) => {
            this.globalList = json.filter((monster: Monster) => monster.max_level >= 99);
            this.setState({ monsterList: this.globalList });
        })
        .then(() => {
            let ids = [
            [1746, 2012, 1619, 0, 0, 0],
            [3535, 2102, 3521, 2948, 2948, 0],
            [0, 2948, 2540, 2540, 2948, 2903],
            [0, 0, 2497, 998, 0, 2012]
            ];

            let monsters: any = [[], [], [], []];

            ids.forEach((idArray, row) => {
            idArray.forEach((id, index) => {
                let temp: any = this.globalList.filter(
                (monster: Monster) => {
                    return monster.id === id;
                })[0];
                
                if (temp) { monsters[row][index] = temp;
                } else { monsters[row][index] = null; }
            });
            });
            
            this.setState({monsters: monsters});
        });
    }

    getAwakeningData() {
        let awakeningUrl = '/static/awakenings.json';

        fetch(awakeningUrl)
        .then(response => response.json())
        .then((json) => {
            this.allAwakenings = json;
        });
    }

    // ===============
    // MODAL FUNCTIONS
    // =============== 

    setSlot = (monster: Monster) => {
        console.debug(`Setting ${monster.name} @ ${this.currentSelection.row}, ${this.currentSelection.index}.`);
        let newMonsters = this.state.monsters;
        newMonsters[this.currentSelection.row][this.currentSelection.index] = monster;
        console.debug(`DEBUG: setting monster and toggling modal.`);
        this.setState((prevState: any) => ({
            monsters: newMonsters,
            modalState: !prevState.modalState
        }));
    }
  
    toggleModal = () => {
        console.debug(`toggling modal`);
        this.setState((prevState: any) => ({
            modalState: !prevState.modalState
        }));
    }

    setSelection = (row: number, index: number) => {
        this.currentSelection.row = row;
        this.currentSelection.index = index;
        this.toggleModal();
        console.debug(`@ ${row}, ${index}.`);
    }

    addAwakening = (awakening: Awakening) => {
        let newAwakeningList = this.state.awakeningList.concat([awakening]);

        this.setState((prevState: any) => ({
            monsterList: prevState.monsterList.filterByAwakening(newAwakeningList),
            awakeningList: newAwakeningList
        }));
    }

    removeAwakening = (index: number) => {
        let newAwakeningList = this.state.awakeningList.filter(
            (awakening: any, i: number) => {
                return i !== index;
            }
        );

        this.setState((prevState: any) => ({
            monsterList: prevState.monsterList.filterByAwakening(newAwakeningList),
            awakeningList: newAwakeningList
        }));
    }

    applySearch = (e: any) => {
        if (e) { this.searchValue = e.target.value; }
        let filteredList: Monster[] = [];

        if (this.searchValue.length >= 2) {
            console.debug(`DEBUG: Searching for ${new RegExp(this.searchValue, 'i')}`);
            filteredList = this.globalList.filter(
                (monster: Monster) => {
                    return monster.name.match(new RegExp(this.searchValue, 'i'));
                }
            );
        } else if ((this.state.awakeningList.length > 0) && (this.searchValue.length < 2)) {
            console.debug(`DEBUG: Search length < 2.`);
            filteredList = this.globalList;
        } else {
            console.debug(`DEBUG: Need at least one filter.`);
        }

        if (filteredList) {
            // re-apply sorting/filters
            if (this.state.awakeningList.length > 0) {
                console.debug(`DEBUG: Filtering by awakenings.`);
                filteredList = filteredList.filterByAwakening(this.state.awakeningList);
            }

            // this.primaryAttributeFilter.forEach((enabled, attributeNumber) => {
            //     if (enabled) {
            //         filteredList = filteredList.filterByPrimaryAttribute(attributeNumber);
            //     }
            // });
        
            // // TODO: combine filterByAttribute functions together
            // this.subAttributeFilter.forEach((enabled, attributeNumber) => {
            //     if (enabled) {
            //         this.filteredList = this.filteredList.filterBySubAttribute(attributeNumber);
            //     }
            // });

            // filteredList = filteredList.sortByStat(this.sortValue);

            console.debug(`DEBUG: found ${filteredList.length} results.`);
            this.setState({monsterList: filteredList});
        }
    }

    componentDidMount() {
        this.getMonsterData();
        this.getAwakeningData();
    }

    componentDidUpdate() {
        console.debug(`Updated State: `, this.state);
    }
}

export default App;