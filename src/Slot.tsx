import * as React from 'react';
import { Monster } from './Monster';

interface Props {
    monster: Monster|null;
    row: number;
    index: number;
    setSlot: (monster: Monster) => void;
    setSelection: (row: number, index: number) => void;
}

class Slot extends React.Component<Props, {}> {
    render() {
        if (this.props.monster) {
            const imgUrl = this.props.monster.image60_href;
            return (
                <a onClick={() => this.props.setSelection(this.props.row, this.props.index)}>
                    <img
                        src={imgUrl}
                        alt={this.props.monster.id.toString()}
                        width={45}
                        height={45}
                    />
                </a>
            );
        } else {
            return (
                <a onClick={() => this.props.setSelection(this.props.row, this.props.index)}>
                    <div className="placeholder" />
                </a>
            );
        }
    }
}

export default Slot;