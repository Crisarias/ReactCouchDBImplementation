import React from 'react';

import Content from '../Content';
import ExperimentList from '../ExperimentList';
import AddExperiment from '../AddExperiment';

export const Home = ({ db }) => (
    <Content>
        <ExperimentList db={db} />
        <AddExperiment db={db} />
    </Content>
);

export default Home;