import { render, screen } from '@testing-library/react';
import ProjectsListTable from "../components/ProjectsListTable/ProjectsListTable"
import { HashRouter } from "react-router-dom";

const mockProjects = [
    {
        "id_": "65a1682caf3fee6e0acd211f",
        "name": "Test Project",
        "description": "This is a Colorado project",
        "state": "CO",
        "history": [
            ""
        ]
    },
    {
        "id_": "65a168bcaf3fee6e0acd2120",
        "name": "Test Project 2",
        "description": "This is a California project",
        "state": "CA",
        "history": [
            ""
        ]
    }
]

test('test project list table', () => {

    render( <HashRouter> <ProjectsListTable projects={mockProjects}/> </HashRouter> )

    //test for component elements
    screen.getByRole('table', {  name: /projects table/i});
    screen.getByRole('columnheader', {  name: /project name/i});
    screen.getByRole('columnheader', {  name: /description/i});
    screen.getByRole('columnheader', {  name: /locations/i});
    screen.getByRole('columnheader', {  name: /date/i});
})