import React from 'react';
import { Box, Button, TextInput, Select, Heading } from "grommet";
import { FormAdd } from "grommet-icons";

export class AddExperiment extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            //dueDate: new Date(),
            process: '',
            steps: '',
        };

        this.changeName.bind(this);
        this.addElement.bind(this);
    }

    changeName(e) {
        this.setState({
            name: e.target.value,
        });
    }

    changeDate(e) {
        this.setState({
            dueDate: e.target.value,
        });
    }

    changeProcess(e) {
        this.setState({
            process:e.option,
        });
    }

    changeSteps(e) {
        this.setState({
            steps: e.target.value,
        });
    }

    addElement() {
        this.props.db.put({
            _id: new Date().toJSON(),
            done: false,
            name: this.state.name,
            process: this.state.process,
            steps: this.state.steps,
        });
    }

    render() {
        return (
            <Box>
                <Box pad="medium" border={{ side: 'top', color: 'light-3' }}>
                    <Heading level="3" margin="none">
                        Add a new experiment
                    </Heading>
                </Box>
                <Box direction="row" pad="medium" gap="small">
                    <TextInput onChange={this.changeName.bind(this)} placeholder="Enter the name" value={this.state.name}/>
                    <Select options={['16nm', '14nm', '10nm', '7nm', '5nm']} value={this.state.process} onChange={this.changeProcess.bind(this)}/>
                    {/* <TextInput onChange={this.changeProcess.bind(this)} placeholder="Enter the process" value={this.state.process}/> */}
                    {/* <TextInput type="date" onChange={this.changeDate.bind(this)} placeholder="Enter the due date" value={this.state.dueDate}/> */}
                    <TextInput onChange={this.changeSteps.bind(this)} placeholder="Enter the steps" value={this.state.steps}/>
                    <Button icon={<FormAdd />} onClick={this.addElement.bind(this)} primary type="button" />
                </Box>
            </Box>
        );
    }
}

export default AddExperiment;