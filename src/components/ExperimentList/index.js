import React from 'react';
import {Box, CheckBox, Text, Button, Heading, Select, Grid} from 'grommet';
import { FormClose } from 'grommet-icons';

import Loading from '../Loading';

export class ExperimentList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            wip: 0,
            done: 0,
            elements: null,
        };
        this.canceler = null;
        this.fetchData.bind(this);
        this.changeDone.bind(this);
        this.deleteElement.bind(this);
    }

    componentDidMount() {
        this.fetchData();
        this.fetchWip(true);
        this.fetchWip(false);
        this.canceler = this.props.db.changes({
            since: 'now',
            live: true,
            include_docs: true,
        }).on('change', () => {
            if(this.state.process === 'All') {
                this.fetchData();
            }
            else {
                this.fetchDataFilteredByProcess(this.state.process);
            }
            this.fetchWip(true);
            this.fetchWip(false);
        });
    }

    componentWillUnmount() {
        this.canceler.cancel();
    }

    fetchData() {
        this.setState({
            loading: true,
            process: 'All',
            elements: null,
        });
        this.props.db.allDocs({
            include_docs: true,
        }).then(result => {
            const rows = result.rows;
            this.setState({
                loading: false,
                elements: rows.filter(function(row) {
                    if (row.doc.views) {
                      return false; // skip
                    }
                    return true;
                  }).map(row => row.doc),
            });            
        }).catch((err) =>{
            console.log(err);
        });
    }

    fetchWip(done) {
        this.props.db.query('experimets_index/by_wip',{
            key: done,
        }).then(result => {
            const count = result.rows.length ? result.rows[0].value : 0;
            if(done) {
                this.setState({
                    done: count
                });
            }
            else {
                this.setState({
                    wip: count
                });
            }
        }).catch((err) =>{
            console.log(err);
        });
    }

    fetchDataFilteredByProcess(process) {
        this.setState({
            loading: true,
            elements: null,
        });
        this.props.db.query('experimets_index/by_process',{
            key: process,
            include_docs: true,
        }).then(result => {
            const rows = result.rows;
            this.setState({
                loading: false,
                elements: rows.map(row => row.doc),
            })
        }).catch((err) =>{
            console.log(err);
            this.setState({
                loading: false,
                elements: null,
            });
        });
    }

    changeProcess(e) {
        this.setState({
            process:e.option,
        });
        if(e.option === 'All') {
            this.fetchData();
        }
        else {
            this.fetchDataFilteredByProcess(e.option);
        }      
    }

    changeDone(e, element) {
        element.done = !element.done;
        this.props.db.put(element);
    }

    deleteElement(element) {
        this.props.db.remove(element);
    }

    render() {
        if (this.state.loading || this.state.elements === null) {
            return <Loading />;
        }
        return (
            <Box>
                <Box
                direction="row"
                pad="small"
                gap="small"
                fill="horizontal"
                >
                <Box
                    direction="row"
                    pad="small"
                    gap="small"
                    justify= "start"
                    align="center"
                    fill="horizontal"
                >
                 <Text tag="div" color="dark-4" weight="bold">Filter by process:</Text>
                 <Select options={['All','16nm', '14nm', '10nm', '7nm', '5nm']} value={this.state.process} onChange={this.changeProcess.bind(this)}/>
                 </Box>
                 <Box
                    direction="row"
                    pad="small"
                    gap="small"
                    justify= "end"
                    align="center"
                    fill="horizontal"
                >
                 <Text tag="div" color="dark-4" weight="bold">WIP: {this.state.wip} , Done: {this.state.done}  </Text>
                </Box>
                </Box>
                <Box
                    direction="row"
                    pad="small"
                    gap="small"
                    align="center"
                    border={{ side: 'all', color: 'light-3' }}
                >
                    <Grid
                        areas={[
                            { name: 'left', start: [0, 0], end: [0, 0] },
                            { name: 'main', start: [1, 0], end: [1, 0] },
                            { name: 'right', start: [2, 0], end: [2, 0] },
                        ]}
                        columns={['xxsmall', 'flex', 'flex', 'flex', 'xsmall']}
                        rows={['full']}
                        gap='small'
                        fill
                    >
                        <Text tag="div" color="dark-4" weight="bold">Done</Text>
                        <Text tag="div" color="dark-4" weight="bold">Title</Text>
                        <Text tag="div" color="dark-4" weight="bold">Process</Text>
                        <Text tag="div" color="dark-4" weight="bold">Steps</Text>
                        <Text tag="div" textAlign="center" color="dark-4" weight="bold">| Delete</Text>
                    </Grid>
                </Box>
                {this.state.elements.map((element, index) => (
                    <Box
                    border={{ side: 'top', color: 'light-3' }}
                    key={element._id}
                    direction="row"
                    pad="medium"
                    gap="small"
                    align="center"
                    >
                        <Grid
                            areas={[
                                { name: 'left', start: [0, 0], end: [0, 0] },
                                { name: 'main', start: [1, 0], end: [1, 0] },
                                { name: 'right', start: [2, 0], end: [2, 0] },
                            ]}
                            columns={['xxsmall', 'flex', 'flex', 'flex', 'xsmall']}
                            rows={['full']}
                            gap='small'
                            fill
                        >
                           <CheckBox checked={element.done} onChange={e => this.changeDone(e, element)} />
                           <Text
                                style={{ textDecoration: element.done ? 'line-through' : ''}}
                                color={element.done ? 'light-5' : 'dark-1'}
                            >
                                {element.name}
                            </Text>
                            <Text
                                style={{ textDecoration: element.done ? 'line-through' : ''}}
                                color={element.done ? 'light-5' : 'dark-1'}
                            >
                                {element.process}
                            </Text>
                            <Text
                                style={{ textDecoration: element.done ? 'line-through' : ''}}
                                color={element.done ? 'light-5' : 'dark-1'}
                            >
                                {element.steps}
                            </Text>
                            <Button icon={<FormClose />} onClick={() => this.deleteElement(element)}/>
                        </Grid>
                    </Box>
                ))}
            </Box>
        );
    }
}

export default ExperimentList;