import * as React from 'react';
import { Monster } from './Monster';
import { Modal } from 'react-bootstrap';
import { Button, FormControl } from 'react-bootstrap';
import 'whatwg-fetch';
import './App.css';
import { Carousel, Well } from 'react-bootstrap';
import { Awakening } from './Awakening';
import { ToggleButtonGroup, ToggleButton } from 'react-bootstrap';
import { Collection } from 'react-virtualized';

interface Props {
    allAwakenings: Awakening[];
    allMonsters: Monster[];
    setSlot: (monster: Monster) => void;
    modalState: boolean;
    toggleModal: () => void;
}

interface State {
    activeIndex: number;
    sortValue: string;
    searchValue: string;
    monsterList: Monster[];
    awakeningList: Awakening[];
}

class MonsterDialog extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            activeIndex: 0,
            sortValue: `total`,
            searchValue: ``,
            monsterList: [],
            awakeningList: [],
        };
    }

    getMonsterWidth = (): number => {
        let width: number;
        const size: number = 45;
        
        if (window.outerWidth > 768) {
            width = Math.floor((598 - 22 - 30) * 0.70 / size) * size
        } else {
            width = Math.floor((window.innerWidth - 22 - 30) * 0.70 / size) * size;
        }

        return width;
    }

    monsterTemplate = (o: { index: number, key: string, style: React.CSSProperties }): JSX.Element => {
        const monster: Monster = this.state.monsterList[o.index];

        return (
            <div key={monster.id} style={o.style}>
                <a onClick={() => this.props.setSlot(monster)}>
                    <img
                        src={'.' + monster.image60_href}
                        alt={monster.id.toString()}
                        width="45"
                        height="45"
                    />
                </a>
            </div>
        );
    }

    sizeAndPosition = (o: { index: number }) => {
        const size = 45;
        const width = this.getMonsterWidth();
        
        return {
            height: size,
            width: size,
            x: (o.index * size) % width,
            y: Math.floor(o.index / (width / size)) * size
        };
    }

    render() {
        let sortOptions = this.getSortOptions();
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
                        placeholder="Enter monster name..."
                        style={{width: '95%'}}
                        onChange={this.applySearch}
                    />
                </Modal.Header>
                <Modal.Body>
                    <Carousel
                        interval={0}
                        defaultActiveIndex={1}
                    >
                        <Carousel.Item>
                            <div className="flex-center">
                                <div className="inner-center">
                                    <div>Sorting Options:</div>
                                    {sortOptions}
                                </div>
                            </div>
                        </Carousel.Item>
                        <Carousel.Item>
                            <div className="flex-center">
                                <div className="inner-center">
                                    <div>Monsters:</div>
                                    <Collection
                                        className="flex-center"
                                        cellCount={this.state.monsterList.length}
                                        cellRenderer={this.monsterTemplate}
                                        cellSizeAndPositionGetter={this.sizeAndPosition}
                                        verticalOverscanSize={200}
                                        height={300}
                                        width={this.getMonsterWidth()}
                                        monsterList={this.state.monsterList}
                                    />
                                </div>
                            </div>
                        </Carousel.Item>
                        <Carousel.Item>
                            <div className="flex-center">
                                <div className="inner-center">
                                    <div>Selected Awakenings:</div>
                                    <Well className="flex-list">{awakenings}</Well>
                                    <div className="flex-list">{allAwakenings}</div>
                                </div>
                            </div>
                        </Carousel.Item>
                    </Carousel>
                </Modal.Body>
                <Modal.Footer>
                    <Button color="secondary" onClick={() => this.props.setSlot(new Monster)}>Remove</Button>
                    <Button color="secondary" onClick={this.props.toggleModal}>Close</Button>
                </Modal.Footer>
            </Modal>
        );
    }

    getSortOptions(): JSX.Element {
        return (
            <ToggleButtonGroup
                className="btn-group-vertical"
                type="radio"
                name="sortOptions"
                value={this.state.sortValue}
                onChange={this.setSortOptions}
                defaultValue={'Total'}
            >
                <ToggleButton value={'id'}>#</ToggleButton>
                <ToggleButton value={'hp'}>HP</ToggleButton>
                <ToggleButton value={'atk'}>ATK</ToggleButton>
                <ToggleButton value={'rcv'}>RCV</ToggleButton>
                <ToggleButton value={'total'}>Total</ToggleButton>
            </ToggleButtonGroup>
        );
    }

    setSortOptions = (e: any): void => {
        this.applySearch(null, undefined, e);
    }

    getMonsters(): JSX.Element[] {
        let monsters: JSX.Element[] = [];
        
        if (this.state.monsterList) {
            for (let monster of this.state.monsterList) {
                let imgUrl = '.' + monster.image60_href;
                monsters.push(
                    <div key={monster.id}>
                        <a onClick={() => this.props.setSlot(monster)}>
                            <img src={imgUrl} alt={monster.id.toString()} />
                        </a>
                    </div>
                );
            }
            return monsters;
        } else {
            return ([<div key={0} />]);
        }
    }

    getAllMonsters(): JSX.Element[] {
        let monsters: JSX.Element[] = [];

        for (let monster of this.props.allMonsters) {
            let imgUrl = '.' + monster.image60_href;
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
                let imgUrl = `./static/img/awakenings/${selectedAwakenings[awakening].id}.png`;
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
            let imgUrl = `./static/img/awakenings/${awakening.id}.png`;
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

    applySearch = (e: any, a?: Awakening[], s?: string) => {
        let searchValue: string = e ? e.target.value : this.state.searchValue;
        let awakeningList: Awakening[] = a ? a : this.state.awakeningList;
        let sortValue: string = s ? s : this.state.sortValue;

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

            console.debug(`DEBUG: Sorting by ${sortValue}`);
            filteredList = filteredList.sortByStat(sortValue);

            console.debug(`DEBUG: found ${filteredList.length} results.`);
            this.setState({
                awakeningList: awakeningList,
                monsterList: filteredList,
                searchValue: searchValue,
                sortValue: sortValue
            });
        }
    }

    shouldComponentUpdate(nextProps: Props, nextState: State) {
        if (this.props.modalState === nextProps.modalState) {
            if ((this.state.monsterList.length === nextState.monsterList.length)
                && (this.state.awakeningList.length === nextState.awakeningList.length)
                && (this.state.sortValue === nextState.sortValue)) {
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