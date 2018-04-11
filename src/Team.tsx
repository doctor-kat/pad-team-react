import * as React from 'react';
import { Monster } from './Monster';
import Slot from './Slot';

interface Props {
    row: number;
    monsters: Monster[];
    setSlot: (monster: Monster) => void;
    setSelection: (row: number, index: number) => void;
}

class Team extends React.Component<Props, {}> {
    render() {
        let slots: JSX.Element[] = [];
        (this.props.monsters).forEach((monster, index) => {
            slots.push(
                <div className="col-lg-2 col-md-2 col-sm-2 slot" key={index}>
                    <Slot
                        monster={monster}
                        row={this.props.row}
                        index={index}
                        setSlot={this.props.setSlot}
                        setSelection={this.props.setSelection}
                    />
                </div>
            );
        });
        
        return (
            <div className="row">
                {slots}
            </div>
        );
    }
}

export default Team;