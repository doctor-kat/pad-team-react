import * as React from 'react';
import { Monster } from './Monster';
import { Modal } from 'react-bootstrap';
import { Button, FormControl } from 'react-bootstrap';
import 'whatwg-fetch';
import './App.css';
import { Carousel, Well } from 'react-bootstrap';
import { Awakening } from './Awakening';
import { ToggleButtonGroup, ToggleButton } from 'react-bootstrap';

interface Props {
    allAwakenings: Awakening[];
    allMonsters: Monster[];
    setSlot: (monster: Monster) => void;
    modalState: boolean;
    toggleModal: () => void;
}

interface State {
    activeIndex: number;
    searchValue: string;
    monsterList: Monster[];
    awakeningList: Awakening[];
}

class MonsterDialog extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            activeIndex: 0,
            searchValue: ``,
            monsterList: [],
            awakeningList: [],
        };
    }

    render() {
        let sortOptions = this.getSortOptions();
        let monsters = this.getMonsters();
        // let allMonsters = this.getAllMonsters();
        let awakenings = this.getAwakenings();
        let allAwakenings = this.getAllAwakenings();

        return (
            <Modal
                show={this.props.modalState}
                onHide={this.props.toggleModal}
            >
                <Modal.Header closeButton={true}>
                    <FormControl
                        type="text"
                        style={{width: '100%'}}
                        onChange={this.applySearch}
                    />
                </Modal.Header>
                <Modal.Body>
                    <Carousel
                        interval={0}
                        defaultActiveIndex={1}
                    >
                        <Carousel.Item>
                            <div className="flex-center">{sortOptions}</div>
                        </Carousel.Item>
                        <Carousel.Item>
                            <div className="flex-list">{monsters}</div>
                        </Carousel.Item>
                        <Carousel.Item>
                            Selected Awakenings:
                            <Well className="flex-list">{awakenings}</Well>
                            <div className="flex-list">{allAwakenings}</div>
                        </Carousel.Item>
                    </Carousel>
                </Modal.Body>
                <Modal.Footer>
                    <Button color="secondary" onClick={this.props.toggleModal}>Close</Button>
                    <Button color="primary" onClick={this.props.toggleModal}>Save changes</Button>
                </Modal.Footer>
            </Modal>
        );
    }
    
    getSortOptions(): JSX.Element {
        return (
            <ToggleButtonGroup
                type="radio"
                name="sortOptions"
                value={() => { console.log(``); }}
                onChange={() => { console.log(``); }}
                defaultValue={'Total'}
            >
                <ToggleButton value={'HP'}>HP</ToggleButton>
                <ToggleButton value={'ATK'}>ATK</ToggleButton>
                <ToggleButton value={'RCV'}>RCV</ToggleButton>
                <ToggleButton value={'Total'}>Total</ToggleButton>
            </ToggleButtonGroup>
        );
    }

    getMonsters(): JSX.Element[] {
        let monsters: JSX.Element[] = [];
        for (let monster of this.state.monsterList) {
            let imgUrl = monster.image60_href;
            monsters.push(
                <div key={monster.id}>
                    <a onClick={() => this.props.setSlot(monster)}>
                        <img src={imgUrl} alt={monster.id.toString()} />
                    </a>
                </div>
            );
        }
        return monsters;
    }

    getAllMonsters(): JSX.Element[] {
        let monsters: JSX.Element[] = [];

        for (let monster of this.props.allMonsters) {
            let imgUrl = monster.image60_href;
            monsters.push(
                <div key={monster.id}>
                    <a onClick={() => this.props.setSlot(monster)}>
                        <img src={imgUrl} alt={monster.id.toString()} />
                    </a>
                </div>
            );
        }

        return monsters;
    }

    getAwakenings(): JSX.Element[] {
        let awakenings: JSX.Element[] = [];
        let selectedAwakenings = this.state.awakeningList;

        for (let awakening in selectedAwakenings) {
            if (selectedAwakenings.hasOwnProperty(awakening)) {
                let imgUrl = `/static/img/awakenings/${selectedAwakenings[awakening].id}.png`;
                awakenings.push(
                    <div key={Number(awakening)}>
                        <a onClick={() => this.removeAwakening(Number(awakening))}>
                            <img src={imgUrl} alt={awakening} />
                        </a>
                    </div>
                );
            }
        }

        // console.debug(`returning awakenings ${awakenings}`);
        return awakenings;
    }

    getAllAwakenings(): JSX.Element[] {
        let awakenings: JSX.Element[] = [];

        for (let awakening of this.props.allAwakenings) {
            let imgUrl = `/static/img/awakenings/${awakening.id}.png`;
            awakenings.push(
                <div key={awakening.id}>
                    <a onClick={() => this.addAwakening(awakening)}>
                        <img src={imgUrl} alt={awakening.id.toString()} />
                    </a>
                </div>
            );
        }

        return awakenings;
    }
    
    addAwakening = (awakening: Awakening) => {
        let newAwakeningList = this.state.awakeningList.concat([awakening]);
        this.applySearch(null, newAwakeningList);
    }

    removeAwakening = (index: number) => {
        let newAwakeningList = this.state.awakeningList.filter(
            (awakening: any, i: number) => {
                return i !== index;
            }
        );
        this.applySearch(null, newAwakeningList);
    }

    applySearch = (e: any, a?: Awakening[]) => {
        let searchValue: string;
        if (e) { searchValue = e.target.value; }
        else { searchValue = this.state.searchValue; }

        let awakeningList: Awakening[];
        if (a) { awakeningList = a; }
        else { awakeningList = this.state.awakeningList; }

        let filteredList: Monster[] = [];

        if (searchValue.length >= 2) {
            console.debug(`DEBUG: Searching for ${new RegExp(searchValue, 'i')}`);
            filteredList = this.props.allMonsters.filter(
                (monster: Monster) => {
                    return monster.name.match(new RegExp(searchValue, 'i'));
                }
            );
        } else if ((awakeningList.length > 0) && (searchValue.length < 2)) {
            console.debug(`DEBUG: Search length < 2.`);
            filteredList = this.props.allMonsters;
        } else {
            console.debug(`DEBUG: Need at least one filter.`);
        }

        if (filteredList) {
            // re-apply sorting/filters
            if (awakeningList.length > 0) {
                console.debug(`DEBUG: Filtering by awakenings.`);
                filteredList = filteredList.filterByAwakening(awakeningList);
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
            this.setState({
                awakeningList: awakeningList,
                monsterList: filteredList,
                searchValue: searchValue
            });
        }
    }

    shouldComponentUpdate(nextProps: Props, nextState: State) {
        if (this.props.modalState === nextProps.modalState) {
            if ((this.state.monsterList.length === nextState.monsterList.length)
                && (this.state.awakeningList.length === nextState.awakeningList.length)) {
                return false;
            } else {
                return true;
            }
        } else {
            return true;
        }
    }

    componentDidMount() {
        console.debug(`Component mounted.`);
    }

    componentDidUpdate() {
        console.debug(`Updated State: `, this.state);
        console.debug(`Props: `, this.props);
    }
}

export default MonsterDialog;