import React from 'react';
import { Button, ButtonGroup } from 'reactstrap';
import { FaCheck , FaTimes} from 'react-icons/fa';

function saveSnippet(){
    console.log("save snippet");
}

function cancel(){
    console.log("cancel");
}




class Tooltip extends React.Component {
    // constructor(props) {
    //     super(props);
    //
    //     // Setting `active` state property from props.
    //     this.state = {
    //         active: props.active,
    //     };
    //
    //     // As we are passing this function as event handler, we need bind context,
    //     // to get access to `this` inside this function.
    //     this.handleCloseClick = this.handleCloseClick.bind(this);
    // }
    //
    // componentWillReceiveProps(nextProps) {
    //     // When we will provide `active` variable via props, we will automatically set it to state.
    //     if (nextProps.active !== this.props.active) {
    //         this.setState({
    //             active: nextProps.active,
    //         });
    //     }
    // }
    //
    //
    // handleCloseClick() {
    //     // On clicking `close` button, setting `active` state variable to `false`,
    //     // it forces component to rerender with new state.
    //     this.setState({
    //         active: false,
    //     });
    // }

    render() {
        console.log("rendered")
        // const { active } = this.state;
        return (
            <ButtonGroup>
                <Button onClick={saveSnippet}><FaCheck /></Button>
                <Button onClick={cancel}><FaTimes /></Button>
            </ButtonGroup>
        )
        ;
    }
}

export default Tooltip;