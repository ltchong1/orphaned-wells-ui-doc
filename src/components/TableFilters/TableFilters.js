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
    const [operator, setOperator] = useState("equals")
    const [currentFilterIndex, setCurrentFilterIndex] = useState(0)
    const openFilterMenu = Boolean(anchorFilterMenu);

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
    const handleOpenFilters = (event) => {
        setAnchorFilterMenu(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorFilterMenu(null);
    };

    const handleChangeOperator = (e) => {
        setOperator(e.target.value)
    }

    const handleChangeFilterIndex = (e) => {
        let newFilterIndex = e.target.value;
        if (filterOptions[newFilterIndex].type === 'checkbox' || filterOptions[newFilterIndex].type === 'string') setOperator('equals');
        else if (filterOptions[newFilterIndex].type === 'date') setOperator('is')
        setCurrentFilterIndex(e.target.value)
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
                
                <Grid sx={styles.menuContainer} container px={5} spacing={5}>
                    <Grid item xs={4}>
                        <FormControl variant="standard" fullWidth>
                            <InputLabel id="column-select-label">Column</InputLabel>
                            <Select
                                labelId="column-select-label"
                                id="column-select"
                                value={currentFilterIndex}
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
                                    filterOptions[currentFilterIndex].type === 'checkbox' ? 
                                    [
                                        <MenuItem key={'checkbox1'} value={"equals"}>Equals</MenuItem>
                                    ]
                                    :
                                    filterOptions[currentFilterIndex].type === 'string' ? 
                                    [
                                        <MenuItem key={'string1'} value={"equals"}>Equals</MenuItem>,
                                        <MenuItem key={'string2'} value={"contains"}>Contains</MenuItem>
                                    ]
                                    : 
                                    filterOptions[currentFilterIndex].type === 'date' &&
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
                            filterOptions[currentFilterIndex].type === 'checkbox' ? 
                            <FormControl variant="standard" fullWidth>
                                <InputLabel id="values-checkbox-label">Values</InputLabel>
                                <Select
                                    labelId="values-checkbox-label"
                                    id="values-checkbox"
                                    multiple
                                    value={[filterOptions[currentFilterIndex].selectedOptions]}
                                    // onChange={handleChange}
                                    label="Values"
                                    renderValue={(selected) => selected.join(', ')}
                                >
                                {filterOptions[currentFilterIndex].options.map((option) => (
                                    <MenuItem 
                                        key={option.name} 
                                        value={option.name} 
                                        onClick={() => handleSelectFilter(filterOptions[currentFilterIndex].key, option.name)}
                                    >
                                        <Checkbox checked={option.checked} />
                                        <ListItemText primary={option.name} />
                                    </MenuItem>
                                ))}
                                </Select>
                            </FormControl> :
                            filterOptions[currentFilterIndex].type === 'string' ?
                            <Box
                                component="form"
                                noValidate
                                autoComplete="off"
                            >
                                <TextField 
                                    id="string-value" 
                                    label="Value" 
                                    variant="standard" 
                                    value={filterOptions[currentFilterIndex].value}
                                />
                            </Box> :
                            filterOptions[currentFilterIndex].type === 'date' &&
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

            
            </Menu>
        }
        
        </div>
    );
}