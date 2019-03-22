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

    render() {
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