import React, { useState } from 'react';
import { Button, Menu, MenuItem, Checkbox, Box, TextField, Select, FormControl, InputLabel, Grid, OutlinedInput, ListItemText } from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

export default function TableFilters(props) {
    const { filterOptions, handleSelectFilter } = props;
    const [anchorFilterMenu, setAnchorFilterMenu] = useState(null);
    const [operator, setOperator] = useState("contains")
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
                                value={"review_status"}
                                label="Column"
                            // onChange={handleChange}
                            >
                                {filterOptions.map((filter)=> (
                                    <MenuItem value={filter.key}>{filter.displayName}</MenuItem>
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
                            // onChange={handleChange}
                            > 
                                <MenuItem value={"contains"}>Contains</MenuItem>
                                <MenuItem value={"equals"}>Equals</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={4}>
                    <FormControl variant="standard" fullWidth>
                        <InputLabel id="values-checkbox-label">Values</InputLabel>
                        <Select
                            labelId="values-checkbox-label"
                            id="values-checkbox"
                            multiple
                            value={[filterOptions[0].selectedOptions]}
                            // onChange={handleChange}
                            label="Values"
                            renderValue={(selected) => selected.join(', ')}
                            // MenuProps={MenuProps}
                        >
                        {filterOptions[0].options.map((option) => (
                            <MenuItem key={option.name} value={option.name} onClick={() => handleSelectFilter(filterOptions[0].key, option.name)}>
                                <Checkbox checked={option.checked} />
                                <ListItemText primary={option.name} />
                            </MenuItem>
                        ))}
                        </Select>
                    </FormControl>
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