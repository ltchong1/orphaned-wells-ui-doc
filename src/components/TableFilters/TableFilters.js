import React, { useState } from 'react';
import { Button, Menu, MenuItem, Checkbox, Box, TextField, IconButton } from '@mui/material';
import { Select, FormControl, InputLabel, Grid, OutlinedInput, ListItemText } from '@mui/material';
// import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import FilterListIcon from '@mui/icons-material/FilterList';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import Draggable from 'react-draggable';
import { FILTER_OPTIONS } from '../../assets/filterOptions';


export default function TableFilters(props) {
    const { applyFilters, appliedFilters } = props;
    const styles = {
        tableFilter: {
            paddingBottom: 2,
        },
        box: {
            width: '50vw',
            display: 'flex',
            justifyContent: 'space-between'
        }
    }
    const [anchorFilterMenu, setAnchorFilterMenu] = useState(null);
    const [ currentFilters, setCurrentFilters ] = useState([])
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
        if (field === 'filter') {
            let updatedValue = structuredClone(FILTER_OPTIONS[newValue])
            tempFilter=updatedValue
            
        } else if (field === 'operator') {
            tempFilter['operator'] = newValue
        } else if (field === 'value') {
            if (tempFilter.type === 'checkbox') {
                let options = tempFilter.options
                let option = options.find((element) => element.name === newValue)
                option.checked = !option.checked
                let selectedOptions = tempFilter.selectedOptions
                let idx = selectedOptions.indexOf(newValue)
                if (idx === -1) selectedOptions.push(newValue)
                else selectedOptions.splice(idx, 1)
            } else {
                tempFilter['value'] = newValue
            }
        }

        tempFilters[idx] = tempFilter
        setCurrentFilters(tempFilters)
    }

    const addNewFilter = () => {
        let tempFilters = [...currentFilters]
        tempFilters.push(structuredClone(FILTER_OPTIONS['review_status']))
        setCurrentFilters(tempFilters)
    }

    const removeFilter = (idx) => {
        let tempFilters = [...currentFilters]
        tempFilters.splice(idx, 1)
        setCurrentFilters(tempFilters)
    }

    const removeAllFilters = () => {
        setCurrentFilters([])
        applyFilters({}, [])
    }

    const handleApplyFilters = () => {
        // reformat filters to pymongo style
        let filterBy = {}
        for (let filter of currentFilters) {
            let nextFilter;
            if (filter.type === 'checkbox') {
                let allOptionsTrue = true
                nextFilter = { "$in": []}
                for (let each of filter.options) {
                    if (each.checked) nextFilter["$in"].push(each.name)
                    else allOptionsTrue = false
                }
                if (allOptionsTrue) { // if all options are checked, no need to add the filter
                    nextFilter = {}
                }
            }
            else if (filter.type === 'date') {
                let date_value = filter.value
                let date_start = Math.floor(new Date(date_value).getTime() / 1000)
                let date_end = date_start+(24*3600)
                if (filter.operator === 'is') {
                    nextFilter = { "$gte": date_start, "$lt": date_end}
                } else if (filter.operator === 'before') {
                    nextFilter = { "$lt": date_start}
                } else if (filter.operator === 'after') {
                    nextFilter = { "$gt": date_end}
                }
                
            }
            else if (filter.type === 'string') {
                if (filter.operator === 'equals') nextFilter = filter.value
                else if (filter.operator === 'contains') nextFilter = {"$regex": filter.value}
            }

            if (Object.keys(filterBy).includes(filter.key)) { // merge them
                filterBy[filter.key] = {...filterBy[filter.key], ...nextFilter}
            } else { // add key
                filterBy[filter.key] = nextFilter;
            }
        }
        console.log(filterBy)
        applyFilters(filterBy, currentFilters)
    }

    return (
        <div>
        <Button
            id="filter-button"
            aria-controls={openFilterMenu ? 'filter-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={openFilterMenu ? 'true' : undefined}
            onClick={handleOpenFilters}
            startIcon={<FilterListIcon/>}
        >
            Filters {appliedFilters.length > 0 && '('+appliedFilters.length+')'}
        </Button>
        {
                <Draggable handle="#filter-menu">
                <Menu
                    id="filter-menu"
                    anchorEl={anchorFilterMenu}
                    open={openFilterMenu}
                    onClose={handleClose}
                    MenuListProps={{
                        'aria-labelledby': 'filter-button',
                    }}
                >
                    <Box p={2} sx={styles.box}>
                        <Button onClick={addNewFilter} startIcon={<AddIcon/>}>New Filter</Button>
                        <Button onClick={removeAllFilters} startIcon={<DeleteIcon/>}>Remove All</Button>
                    </Box>
                    {
                        currentFilters.map((filter, idx) => (
                            <Box key={idx} sx={styles.tableFilter}>
                                <TableFilter
                                    thisFilter={currentFilters[idx]}
                                    updateCurrentFilters={updateCurrentFilters}
                                    filterIndex={filter.filterIndex}
                                    operator={filter.operator}
                                    idx={idx}
                                    removeFilter={removeFilter}
                                />
                            </Box>
                            
                        ))
                    }
                    
                    <Box sx={{display: 'flex', justifyContent: 'space-around', paddingBottom: 2}}>
                        <Button 
                            onClick={handleApplyFilters} 
                            variant='contained'
                            // disabled={currentFilters.length === 0}
                        >
                            Apply Filters
                        </Button>
                    </Box>
                </Menu>
                </Draggable>

        }
        
        </div>
    );
}


function TableFilter(props) {
    const { thisFilter, updateCurrentFilters, operator, idx, removeFilter } = props;

    const styles = {
        menuContainer: {
            // width: "50vw",
        },
        filterTitle: {
            fontWeight: "bold",
            fontSize: "16px",
            margin: "10px"
        },
    }

    const handleUpdateCheckbox = (name) => {
        updateCurrentFilters(idx, 'value', name)
    }

    const handleChange = (e, field) => {
        updateCurrentFilters(idx, field, e.target.value)
    }

    return (    
        <Grid sx={styles.menuContainer} container px={2} spacing={2}>
            <Grid item xs={4} sx={{display: 'flex', justifyContent: 'flex-start'}}>
                <IconButton sx={{mr: 1}} onClick={() => removeFilter(idx)}>
                    <CloseIcon/>
                </IconButton>
                <FormControl variant="standard" fullWidth>
                    <InputLabel id="column-select-label">Column</InputLabel>
                    <Select
                        labelId="column-select-label"
                        id="column-select"
                        value={thisFilter.key}
                        label="Column"
                        onChange={(e) => handleChange(e, 'filter')}
                    >
                        {Object.entries(FILTER_OPTIONS).map(([key, filter])=> (
                            <MenuItem key={key} value={key}>{filter.displayName}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Grid>
            
            <Grid item xs={2}>
                <FormControl variant="standard" fullWidth>
                    <InputLabel id="operator-select-label">Operator</InputLabel>
                    <Select
                        labelId="operator-select-label"
                        id="operator-select"
                        value={operator}
                        label="Operator"
                        onChange={(e) => handleChange(e, 'operator')}
                    > 
                        {
                            thisFilter.type === 'checkbox' ? 
                            [
                                <MenuItem key={'checkbox1'} value={"equals"}>Equals</MenuItem>
                            ]
                            :
                            thisFilter.type === 'string' ? 
                            [
                                <MenuItem key={'string1'} value={"equals"}>Equals</MenuItem>,
                                <MenuItem key={'string2'} value={"contains"}>Contains</MenuItem>
                            ]
                            : 
                            thisFilter.type === 'date' &&
                            [
                                <MenuItem key={'date1'} value={"is"}>Is</MenuItem>,
                                <MenuItem key={'date2'} value={"before"}>Is Before</MenuItem>,
                                <MenuItem key={'date3'} value={"after"}>Is After</MenuItem>
                            ]
                        }
                    </Select>
                </FormControl>
            </Grid>

            <Grid item xs={6}>
                {
                    thisFilter.type === 'checkbox' ? 
                    <FormControl variant="standard" fullWidth>
                        <InputLabel id="values-checkbox-label">Values</InputLabel>
                        <Select
                            labelId="values-checkbox-label"
                            id="values-checkbox"
                            multiple
                            value={thisFilter.selectedOptions}
                            label="Values"
                            renderValue={(selected) => selected.join(', ')}
                        >
                        {thisFilter.options.map((option) => (
                            <MenuItem 
                                key={option.name} 
                                value={option.name}
                                onClick={() => handleUpdateCheckbox(option.name)}
                            >
                                <Checkbox checked={option.checked} />
                                <ListItemText primary={option.name} />
                            </MenuItem>
                        ))}
                        </Select>
                    </FormControl> :
                    thisFilter.type === 'string' ?
                    <Box
                        component="form"
                        noValidate
                        autoComplete="off"
                    >
                        <TextField 
                            id="string-value" 
                            label="Value" 
                            variant="standard"
                            onChange={(e) => handleChange(e, 'value')}
                            value={thisFilter.value}
                            fullWidth
                        />
                    </Box> :
                    thisFilter.type === 'date' &&
                    <TextField 
                        inputProps={{
                            "step": 1,
                        }}
                        InputLabelProps={{ shrink: true }} 
                        type="date"
                        label="Date" 
                        variant="standard"
                        onChange={(e) => handleChange(e, 'value')}
                        value={thisFilter.value}
                        // fullWidth
                    />
                }
                
            </Grid>
        </Grid>
    );
}