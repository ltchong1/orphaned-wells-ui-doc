import React, { useState } from 'react';
import { Button, Menu, MenuItem, Checkbox, Box, TextField } from '@mui/material';
import { Select, FormControl, InputLabel, Grid, OutlinedInput, ListItemText } from '@mui/material';
// import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import FilterListIcon from '@mui/icons-material/FilterList';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

export default function TableFilters(props) {
    const { filterOptions, handleSelectFilter } = props;
    const [anchorFilterMenu, setAnchorFilterMenu] = useState(null);
    const [ currentFilters, setCurrentFilters ] = useState([
        {
            filterIndex: 0,
            operator: 'equals'
        }
    ])
    const openFilterMenu = Boolean(anchorFilterMenu);

    const handleOpenFilters = (event) => {
        setAnchorFilterMenu(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorFilterMenu(null);
    };

    const updateCurrentFilters = (idx, field, newValue) => {
        let tempFilters = [...currentFilters]
        let tempFilter = {...tempFilters[idx]}
        tempFilter[field] = newValue
        if (field === 'filterIndex') {
            if (filterOptions[newValue].type === 'date')  {
                tempFilter['operator'] = 'is'
            }
            else { 
                tempFilter['operator'] = 'equals'
            }
        }
        tempFilters[idx] = tempFilter
        setCurrentFilters(tempFilters)
    }

    return (
        <div>
        <Button
            id="filter-button"
            aria-controls={openFilterMenu ? 'filter-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={openFilterMenu ? 'true' : undefined}
            onClick={handleOpenFilters}
            endIcon={<FilterListIcon/>}
        >
            Filters
        </Button>
        {
            <Menu
                id="filter-menu"
                anchorEl={anchorFilterMenu}
                open={openFilterMenu}
                onClose={handleClose}
                MenuListProps={{
                    'aria-labelledby': 'filter-button',
                }}
            >
                {
                    currentFilters.map((filter, idx) => (
                        <TableFilter
                            key={idx}
                            filterOptions={filterOptions}
                            handleSelectFilter={handleSelectFilter}
                            updateCurrentFilters={updateCurrentFilters}
                            filterIndex={filter.filterIndex}
                            operator={filter.operator}
                            idx={idx}
                        />
                    ))
                }
            </Menu>
        }
        
        </div>
    );
}


function TableFilter(props) {
    const { filterOptions, handleSelectFilter, updateCurrentFilters, filterIndex, operator, idx } = props;

    const styles = {
        menuContainer: {
            maxWidth: "75vw",
            minWidth: '25vw'
        },
        filterTitle: {
            fontWeight: "bold",
            fontSize: "16px",
            margin: "10px"
        },
    }

    const handleChangeOperator = (e) => {
        let newOperator = e.target.value
        updateCurrentFilters(idx, 'operator', newOperator)
    }

    const handleChangeFilterIndex = (e) => {
        let newFilterIndex = e.target.value;
        updateCurrentFilters(idx, 'filterIndex', newFilterIndex)
    }

    return (    
        <Grid sx={styles.menuContainer} container px={5} spacing={5}>
            <Grid item xs={4}>
                <FormControl variant="standard" fullWidth>
                    <InputLabel id="column-select-label">Column</InputLabel>
                    <Select
                        labelId="column-select-label"
                        id="column-select"
                        value={filterIndex}
                        label="Column"
                        onChange={handleChangeFilterIndex}
                    >
                        {filterOptions.map((filter, idx)=> (
                            <MenuItem key={idx} value={idx}>{filter.displayName}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Grid>
            
            <Grid item xs={4}>
                <FormControl variant="standard" fullWidth>
                    <InputLabel id="operator-select-label">Operator</InputLabel>
                    <Select
                        labelId="operator-select-label"
                        id="operator-select"
                        value={operator}
                        label="Operator"
                        onChange={handleChangeOperator}
                    > 
                        {
                            filterOptions[filterIndex].type === 'checkbox' ? 
                            [
                                <MenuItem key={'checkbox1'} value={"equals"}>Equals</MenuItem>
                            ]
                            :
                            filterOptions[filterIndex].type === 'string' ? 
                            [
                                <MenuItem key={'string1'} value={"equals"}>Equals</MenuItem>,
                                <MenuItem key={'string2'} value={"contains"}>Contains</MenuItem>
                            ]
                            : 
                            filterOptions[filterIndex].type === 'date' &&
                            [
                                <MenuItem key={'date1'} value={"is"}>Is</MenuItem>,
                                <MenuItem key={'date2'} value={"before"}>Is Before</MenuItem>,
                                <MenuItem key={'date3'} value={"after"}>Is After</MenuItem>
                            ]
                        }
                    </Select>
                </FormControl>
            </Grid>

            <Grid item xs={4}>
                {
                    filterOptions[filterIndex].type === 'checkbox' ? 
                    <FormControl variant="standard" fullWidth>
                        <InputLabel id="values-checkbox-label">Values</InputLabel>
                        <Select
                            labelId="values-checkbox-label"
                            id="values-checkbox"
                            multiple
                            value={[filterOptions[filterIndex].selectedOptions]}
                            // onChange={handleChange}
                            label="Values"
                            renderValue={(selected) => selected.join(', ')}
                        >
                        {filterOptions[filterIndex].options.map((option) => (
                            <MenuItem 
                                key={option.name} 
                                value={option.name} 
                                onClick={() => handleSelectFilter(filterOptions[filterIndex].key, option.name)}
                            >
                                <Checkbox checked={option.checked} />
                                <ListItemText primary={option.name} />
                            </MenuItem>
                        ))}
                        </Select>
                    </FormControl> :
                    filterOptions[filterIndex].type === 'string' ?
                    <Box
                        component="form"
                        noValidate
                        autoComplete="off"
                    >
                        <TextField 
                            id="string-value" 
                            label="Value" 
                            variant="standard" 
                            value={filterOptions[filterIndex].value}
                        />
                    </Box> :
                    filterOptions[filterIndex].type === 'date' &&
                    <TextField 
                        inputProps={{
                            "step": 1,
                        }}
                        type="date"
                    />
                }
                
            </Grid>

            <Grid item xs={12} sx={{display: 'flex', justifyContent: 'space-between'}}>
                <Button startIcon={<AddIcon/>}>New Filter</Button>
                <Button startIcon={<DeleteIcon/>}>Remove All</Button>
            </Grid>
        </Grid>
    );
}