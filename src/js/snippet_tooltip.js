import React from 'react';
import { Button, ButtonGroup } from 'reactstrap';
import { FaCheck , FaTimes} from 'react-icons/fa';
import * as ReactDOM from "react-dom";

const MyReactComponent = (props) => <div>

    <ButtonGroup>
        <Button onClick={props.onSave}><FaCheck /></Button>
        <Button onClick={props.onClose}><FaTimes /></Button>
    </ButtonGroup>

</div>;


// function saveSnippet(){
//     console.log("save snippet");
// }
//
// function cancel(){
//     console.log("cancel");
//
// }


class Tooltip extends React.Component {
    closeChild = () => {
        this.setState({
            showChild: false
        });
    };

    save = () => {
        console.log("save snippet")
    };
    constructor(...args) {
        super(...args);
        this.state = {
            showChild: true
        };
    }

    render() {
        console.log("rendered")
        return (
            <div>
                {this.state.showChild && <MyReactComponent onClose={this.closeChild} onSave = {this.save}/>}
            </div>
        );
    }
    // render() {
    //     console.log("rendered")
    //     // const { active } = this.state;
    //     return (
    //         <ButtonGroup>
    //             <Button onClick={saveSnippet}><FaCheck /></Button>
    //             <Button onClick={cancel}><FaTimes /></Button>
    //         </ButtonGroup>
    //     )
    //     ;
    // }
}

export default Tooltip;