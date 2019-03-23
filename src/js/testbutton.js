const MyReactComponent = (props) => <div>

    <h1>TEST</h1>

    <button onClick={props.onClose}>Self Close</button>

</div>;

class ParentComponent extends React.Component {
    // Note: This uses the class fields proposal, currently at Stage 3 and
    // commonly transpiled in React projects


    handleCloseClick() {
        // On clicking `close` button, setting `active` state variable to `false`,
        // it forces component to rerender with new state.
        this.setState({
            active: false,
        });
    }
    render() {
        const { active } = this.state;
        return (

            <div>
                {this.state.showChild && <MyReactComponent onClose={this.closeChild} />}
            </div>
        );
    }
}