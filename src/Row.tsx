import * as React from 'react';
import { Monster } from './Monster';
import Slot from './Slot';
import { Col } from 'react-bootstrap';
import { KeyboardArrowDown, KeyboardArrowUp } from '@material-ui/icons';

interface Props {
    row: number;
    type: string;
    monsters: (Monster|null)[];
    setSlot: (monster: Monster) => void;
    setSelection: (row: number, index: number) => void;
}

class Row extends React.Component<Props, {}> {
    render() {
        let slots: JSX.Element[] = [];
        let style: React.CSSProperties = {};
        (this.props.monsters).forEach((monster, index) => {
            let assistUp: JSX.Element, assistDown: JSX.Element;
            if ((this.props.type === 'assist') && (monster) && (this.props.row % 2 === 0)) {
                assistUp = (<KeyboardArrowDown style={{textAlign: 'center'}} />);
            } else { assistUp = (<i/>); }
            if ((this.props.type === 'assist') && (monster) && (this.props.row % 2 === 1)) {
                assistDown = (<KeyboardArrowUp/>);
            } else { assistDown = (<i/>); }

            slots.push(
                <Col lg={2} md={2} sm={2} xs={2} className="slot" key={index}>
                    {assistDown}
                    <Slot
                        monster={monster}
                        row={this.props.row}
                        index={index}
                        setSlot={this.props.setSlot}
                        setSelection={this.props.setSelection}
                    />
                    {assistUp}
                </Col>
            );
        });
        
        if (this.props.row % 2 === 0) {
            style = {display: 'flex', alignItems: 'flex-start'};
        } else {
            style = {display: 'flex', alignItems: 'flex-end'};
        }

        return (
            <div className="row" style={style}>
                {slots}
            </div>
        );
    }
}

export default Row;