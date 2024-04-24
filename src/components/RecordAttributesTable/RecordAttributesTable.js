import { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableRow, TableContainer } from '@mui/material';
import { Box, TextField, Collapse, Typography, IconButton } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { formatConfidence } from '../../assets/helperFunctions';


const styles = {
    fieldsTable: {
        width: "100%",
        maxHeight: "70vh",
        backgroundColor: "white"
    },
    tableHead: {
        backgroundColor: "#EDF2FA",
        fontWeight: "bold",
    }, 
    fieldKey: {
        cursor: "pointer",
    },
    headerRow: {
        fontWeight: "bold"
    },
}

export default function AttributesTable(props) {
    const { attributes, handleClickField, handleChangeValue, fullscreen, displayKey, forceOpenSubtable, attributesList, displayKeyIndex } = props

    return (
        <TableContainer id="table-container" sx={styles.fieldsTable}>
            <Table stickyHeader>
                <TableHead sx={styles.tableHead}>
                    <TableRow >
                        <TableCell sx={styles.headerRow}>Field</TableCell>
                        <TableCell sx={styles.headerRow}>Value</TableCell>
                        {
                            fullscreen === "table" && 
                            <TableCell sx={styles.headerRow}>Confidence</TableCell>
                        }
                    </TableRow>
                </TableHead>
                <TableBody>
                    {Object.entries(attributes).map(([k, v]) => (
                        <AttributeRow 
                            key={k}
                            k={k}
                            v={v}
                            handleClickField={handleClickField}
                            handleChangeValue={handleChangeValue}
                            fullscreen={fullscreen}
                            displayKey={displayKey}
                            forceOpenSubtable={forceOpenSubtable}
                            attributesList={attributesList}
                            displayKeyIndex={displayKeyIndex}
                        />
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}

function AttributeRow(props) { 
    const { k, v, handleClickField, handleChangeValue, fullscreen, displayKey, forceOpenSubtable, attributesList, displayKeyIndex } = props
    const [ editMode, setEditMode ] = useState(false)
    const [ openSubtable, setOpenSubtable ] = useState(false)

    useEffect(() => {
        if (forceOpenSubtable === k) setOpenSubtable(true)
    }, [forceOpenSubtable])

    const handleDoubleClick = () => {
        setEditMode(true)
    }

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            setEditMode(false)
        } 
    }

    const formatSubattributesTogether = (attr) => {
        let total = ""
        for (let key of Object.keys(attr)) {
            let value = attr[key].value
            total += value += " "
        }
        return total
    }

    return (
    <>
        <TableRow id={k}>
            <TableCell sx={styles.fieldKey}>
                
                <span 
                    onClick={() => handleClickField(k, v.normalized_vertices)}
                    style={k === displayKey ? {fontWeight:"bold"} : {}}
                >
                    {k}
                </span>
                {
                    v.subattributes &&
                    <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => setOpenSubtable(!openSubtable)}
                    >
                        {openSubtable ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                }
            </TableCell>
            {
                v.subattributes ? 
                <TableCell>

                    {formatSubattributesTogether(v.subattributes)}
                </TableCell> 
                
                :
                <TableCell onDoubleClick={handleDoubleClick} onKeyDown={handleKeyDown}>
                    {editMode ? 
                        <TextField 
                            autoFocus
                            name={k}
                            size="small" 
                            // label={""} 
                            defaultValue={v.value} 
                            onChange={handleChangeValue} 
                            onFocus={(event) => event.target.select()}
                        />
                        :
                        v.value
                    }
                </TableCell>
            }
            
            {
                fullscreen === "table" && 
                <TableCell>{formatConfidence(v.confidence)}</TableCell>
            }
        </TableRow>
        {
            v.subattributes &&
            <SubattributesTable 
                attributes={v.subattributes}
                handleClickField={handleClickField}
                handleChangeValue={handleChangeValue}
                open={openSubtable}
                topLevelAttribute={k}
                fullscreen={fullscreen}
                displayKey={displayKey}
                attributesList={attributesList}
                displayKeyIndex={displayKeyIndex}
            />
        }
    </>
    )
}

function SubattributesTable(props) {
    const { attributes, handleClickField, handleChangeValue, open, topLevelAttribute, fullscreen, displayKey, attributesList, displayKeyIndex } = props

    return (
        <TableRow>
            <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
            <Collapse in={open} timeout="auto" unmountOnExit>
                <Box sx={{ margin: 1 }}>
                <Typography variant="h6" gutterBottom component="div">
                    Properties
                </Typography>
                <Table size="small" aria-label="purchases">
                    <TableHead>
                    <TableRow>
                        <TableCell sx={styles.headerRow}>Field</TableCell>
                        <TableCell sx={styles.headerRow}>Value</TableCell>
                        {
                            fullscreen === "table" && 
                            <TableCell sx={styles.headerRow}>Confidence</TableCell>
                        }
                    </TableRow>
                    </TableHead>
                    <TableBody>
                    {Object.entries(attributes).map(([k, v]) => (
                        <SubattributeRow 
                            key={k}
                            k={k}
                            v={v}
                            handleClickField={handleClickField}
                            handleChangeValue={handleChangeValue}
                            topLevelAttribute={topLevelAttribute}
                            fullscreen={fullscreen}
                            displayKey={displayKey}
                            attributesList={attributesList}
                            displayKeyIndex={displayKeyIndex}
                        />
                    ))}
                    </TableBody>
                </Table>
                </Box>
            </Collapse>
            </TableCell>
        </TableRow>
    )
}

function SubattributeRow(props) { 
    const { k, v, handleClickField, handleChangeValue, topLevelAttribute, fullscreen, displayKey, attributesList, displayKeyIndex } = props
    const [ editMode, setEditMode ] = useState(false)

    const handleDoubleClick = () => {
        setEditMode(true)
    }

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            setEditMode(false)
        } 
    }

    const handleUpdateValue = (event) => {
        // TODO: gotta update handlechange function to handle subattributes
        handleChangeValue(event, true, topLevelAttribute)
    }

    return (
        <TableRow key={k} id={`${topLevelAttribute}::${k}`}>
            <TableCell sx={styles.fieldKey} >
            <span 
                onClick={() => handleClickField(k, v.normalized_vertices, true, topLevelAttribute)}
                style={ (k === displayKey && topLevelAttribute === attributesList[displayKeyIndex].topLevelAttribute) ? {fontWeight:"bold"} : {}}
            >
                {k}
            </span>
            </TableCell>
            <TableCell onDoubleClick={handleDoubleClick} onKeyDown={handleKeyDown}>
                {editMode ? 
                    <TextField 
                        autoFocus
                        name={k}
                        size="small" 
                        // label={""} 
                        defaultValue={v.value} 
                        onChange={handleUpdateValue} 
                        onFocus={(event) => event.target.select()}
                    />
                    :
                    v.value
                }
            </TableCell>
            {
                fullscreen === "table" && 
                <TableCell>{formatConfidence(v.confidence)}</TableCell>
            }
        </TableRow>
    )
}