import { render, screen } from '@testing-library/react';
import RecordsTable from "../components/RecordsTable/RecordsTable"
import { HashRouter } from "react-router-dom";
import mockRecordGroups from './mockRecordGroups.json'

const mockFunction = (): void => {}

test('test records table', (): void => {

    render( 
        <HashRouter> 
            <RecordsTable
                records={[]}
                pageSize={25}
                currentPage={0}
                recordCount={10}
                appliedFilters={[]}
                sortBy={"dateAscending"}
                sortAscending={1}
                setRecords={mockFunction}
                setSortBy={mockFunction}
                setPageSize={mockFunction}
                setCurrentPage={mockFunction}
                handleApplyFilters={mockFunction}
                setSortAscending={mockFunction}
                setOpenColumnSelect={mockFunction}
            /> 
        </HashRouter> )

    //test for component elements
    screen.getByRole('table', {  name: /records table/i});
    screen.getByRole('columnheader', {  name: /date uploaded/i});
    screen.getByRole('columnheader', {  name: /digitization status/i});
    screen.getByRole('columnheader', {  name: /review status/i});
})