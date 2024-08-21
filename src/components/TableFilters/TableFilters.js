import React, { useState } from 'react';
import { Button, Menu, MenuItem, Checkbox } from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';

export default function TableFilters(props) {
    const { filterOptions, handleSelectFilter } = props;
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const styles = {
        filterTitle: {
            fontWeight: "bold",
            fontSize: "16px",
            margin: "10px"
        }
    }
    const handleOpenFilters = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <div>
        <Button
            id="filter-button"
            aria-controls={open ? 'filter-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            onClick={handleOpenFilters}
            endIcon={<FilterListIcon/>}
        >
            Filters
        </Button>
        {
            filterOptions.map((filter) => (
                <Menu
                    key={filter.displayName}
                    id="filter-menu"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    MenuListProps={{
                        'aria-labelledby': 'filter-button',
                    }}
                >
                    
                    {
                        <p style={styles.filterTitle}>
                            {filter.displayName}
                        </p>
                        
                    }
                    {
                        filter.options.map((option) => (
                            <MenuItem key={option.name} onClick={() => handleSelectFilter(filter.key, option.name)}>
                                <Checkbox checked={option.checked} />
                                {option.name}
                            </MenuItem>
                        ))
                    }
                    
                </Menu>
            ))
        }
        
        </div>
    );
}