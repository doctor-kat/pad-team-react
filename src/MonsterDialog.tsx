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
    monsters: [Monster[], Monster[], Monster[], Monster[]];
    monsterList: Monster[];
    allAwakenings: Awakening[];
    awakenings: Awakening[];
    applySearch: (e: any) => void;
    setSlot: (monster: Monster) => void;
    addAwakening: (awakening: Awakening) => void;
    removeAwakening: (index: number) => void;
    modalState: boolean;
    toggleModal: () => void;
}

interface State {
    activeIndex: number;
}

class MonsterDialog extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            activeIndex: 0
        };
    }

    render() {
        let sortOptions = this.getSortOptions();
        let monsters = this.getMonsters();
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
                        onChange={this.props.applySearch}
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

        for (let monster of this.props.monsterList) {
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
        let selectedAwakenings = this.props.awakenings;

        for (let awakening in selectedAwakenings) {
            if (selectedAwakenings.hasOwnProperty(awakening)) {
                let imgUrl = `/static/img/awakenings/${selectedAwakenings[awakening].id}.png`;
                awakenings.push(
                    <div key={Number(awakening)}>
                        <a onClick={() => this.props.removeAwakening(Number(awakening))}>
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
                    <a onClick={() => this.props.addAwakening(awakening)}>
                        <img src={imgUrl} alt={awakening.id.toString()} />
                    </a>
                </div>
            );
        }

        return awakenings;
    }
    
    shouldComponentUpdate(nextProps: Props, nextState: {}) {
        if (this.props.modalState === nextProps.modalState) {
            if ((this.props.monsterList.length === nextProps.monsterList.length)
                && (this.props.awakenings.length === nextProps.awakenings.length)) {
                return false;
            } else {
                return true;
            }
        } else {
            return true;
        }
    }

    componentDidUpdate() {
        console.debug(`Component was updated.`);
    }
}

export default MonsterDialog;