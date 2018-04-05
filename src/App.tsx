import * as React from 'react';
import Team from './Team';
import { Monster } from './Monster';
import AssistSpacer from './AssistSpacer';
import MonsterDialog from './MonsterDialog';
import './App.css';

/*type State = {
    monsters: [Monster[], Monster[], Monster[], Monster[]],
    monsterList: Monster[],
    modalState: boolean
};*/

class App extends React.Component<{}, any> {
    currentSelection = { row: 0, index: 0 };
    globalList: Monster[] = [];

    constructor(props: {}) {
      super(props);
      this.state = {
        monsters: [[], [], [], []],
        monsterList: [],
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
                    applySearch={this.applySearch}
                    setSlot={this.setSlot}
                    modalState={this.state.modalState}
                    toggleModal={this.toggleModal}
                />
            </div>
        );
    }

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

  getMonsterData() {
    let monsterUrl = '/static/monsters.json';

    fetch(monsterUrl)
      .then(response => response.json())
      .then((json) => {
        this.globalList = json.filter((monster: Monster) => monster.max_level >= 99);
        this.setState({ monsterList: this.globalList.slice(0, 100) });
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

  applySearch = (e: any) => {
    let searchValue: string = e.target.value;
    let filteredList: Monster[] = [];

    if (searchValue.length >= 2) {
        console.debug(`DEBUG: Searching for ${new RegExp(searchValue, 'i')}`);
        filteredList = this.globalList.filter(
          (monster: Monster) => {
            return monster.name.match(new RegExp(searchValue, 'i'));
          }
        );
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

    console.debug(`DEBUG: found ${filteredList.length} results.`);
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