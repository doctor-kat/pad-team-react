import * as React from 'react';
import Row from './Row';
import { Monster } from './Monster';
import { Awakening } from './Awakening';
import './Monster-Array';
import MonsterDialog from './MonsterDialog';
import './App.css';

type State = {
    monsters: [(Monster|null)[], (Monster|null)[], (Monster|null)[], (Monster|null)[]];
    modalState: boolean;
    currentSelection: { row: number, index: number };
    allMonsters: Monster[];
    allAwakenings: Awakening[];
    searchValue: string;
};

class App extends React.Component<{}, State> {
    constructor(props: {}) {
        super(props);
        this.state = {
            monsters: [[], [], [], []],
            modalState: false,
            currentSelection: { row: 0, index: 0 },
            allMonsters: [],
            allAwakenings: [],
            searchValue: ``,
        };
    }

    render() {
        return (
            <div className="container">
                <div className="team">
                    <Row
                        row={0}
                        monsters={this.state.monsters[0]}
                        setSlot={this.setSlot}
                        setSelection={this.setSelection}
                        type="assist"
                    />
                    <Row
                        row={1}
                        monsters={this.state.monsters[1]}
                        setSlot={this.setSlot}
                        setSelection={this.setSelection}
                        type="subs"
                    />
                </div>
                <div className="team">
                    <Row
                        row={2}
                        monsters={this.state.monsters[2]}
                        setSlot={this.setSlot}
                        setSelection={this.setSelection}
                        type="subs"
                    />
                    <Row
                        row={3}
                        monsters={this.state.monsters[3]}
                        setSlot={this.setSlot}
                        setSelection={this.setSelection}
                        type="assist"
                    />
                </div>
                <MonsterDialog
                    allAwakenings={this.state.allAwakenings}
                    allMonsters={this.state.allMonsters}
                    setSlot={this.setSlot}
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
        let monsterUrl = './static/monsters.json';

        fetch(monsterUrl)
        .then(response => response.json())
        .then((json) => {
            this.setState({
                allMonsters:  json.filter((monster: Monster) => monster.max_level >= 99)
            });
        })
        .then(() => {
            let ids = [
            [1746, 2012, 1619, 0, 0, 0],
            [3535, 2102, 3521, 2948, 2948, 0],
            [0, 2948, 2540, 2540, 2948, 2903],
            [0, 0, 2497, 998, 0, 2012]
            ];

            let monsters: [(Monster|null)[], (Monster|null)[], (Monster|null)[], (Monster|null)[]]
                = [[], [], [], []];

            ids.forEach((idArray, row) => {
            idArray.forEach((id, index) => {
                let temp: any = this.state.allMonsters.filter(
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
        let awakeningUrl = './static/awakenings.json';

        fetch(awakeningUrl)
        .then(response => response.json())
        .then((json) => {
            this.setState({
                allAwakenings: json
            });
        });
    }

    // ===============
    // MODAL FUNCTIONS
    // =============== 

    setSlot = (monster: Monster) => {
        let row = this.state.currentSelection.row;
        let index = this.state.currentSelection.index;
        let newMonsters = this.state.monsters;

        if (monster.id === undefined) {
            console.debug(`Removing monster...`);
            newMonsters[row][index] = null;
        } else {
            console.debug(`Setting ${monster.name} @ ${row}, ${index}.`);
            newMonsters[row][index] = monster;
        }

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
        this.state.currentSelection.row = row;
        this.state.currentSelection.index = index;
        this.toggleModal();
        console.debug(`@ ${row}, ${index}.`);
    }

    // ===================
    // LIFECYCLE FUNCTIONS
    // ===================

    componentDidMount() {
        this.getMonsterData();
        this.getAwakeningData();
    }

    componentDidUpdate() {
        console.debug(`Updated State: `, this.state);
    }
}

export default App;