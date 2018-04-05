import * as React from 'react';
import { Monster } from './Monster';

interface Props {
    monsters: Monster[];
}

class AssistSpacer extends React.Component<Props, {}> {
    render() {
        let elements: JSX.Element[] = [];
        
        (this.props.monsters).forEach((monster, index) => {
            if (monster) {
                elements.push(
                    <div className="col-2 slot" key={index}>
                        <i className="material-icons">arrow_downward</i>
                        <i className="material-icons">arrow_upward</i>
                    </div>
                );
            } else {
                elements.push(
                    <div className="col-2 slot" key={index}/>
                );
            }
        });

        return (
            <div className="row">
                {elements}
            </div>
        );
    }
}

export default AssistSpacer;