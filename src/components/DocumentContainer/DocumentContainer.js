import { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableRow, TableContainer } from '@mui/material';
import { Grid, Box, TextField, Collapse, Typography, IconButton } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import LassoSelector from '../../components/LassoSelector/LassoSelector';
import { ImageCropper } from '../ImageCropper/ImageCropper';
import { formatConfidence, useKeyDown } from '../../assets/helperFunctions';

const styles = {
    imageBox: {
        height: "65vh",
        overflowX: "scroll"
    },
    image: {
        height: "50vh"
    },
    fieldsTable: {
        width: "100%",
        maxHeight: "65vh",
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
    gridContainer: {
        backgroundColor: "white",
        // pt: 1,
    },
    containerActions: {
        display: 'flex',
        justifyContent: 'flex-end',
        marginRight:'10px',
        // height: '40px'
    },
}


export default function DocumentContainer(props) {
    const { image, attributes, handleChangeValue, attributesList } = props;
    const [ displayPoints, setDisplayPoints ] = useState(null)
    const [ displayKey, setDisplayKey ] = useState(null)
    const [ displayKeyIndex, setDisplayKeyIndex ] = useState(null)
    const [ fullscreen, setFullscreen ] = useState(null)
    const [ gridWidths, setGridWidths ] = useState([5.9,0.2,5.9])
    const [ width, setWidth ] = useState("100%")
    const [ height, setHeight ] = useState("auto")
    const [ forceOpenSubtable, setForceOpenSubtable ] = useState(null)

    const imageDivStyle={
        width: width,
        height: height,
    }

    useKeyDown(() => {
        tabCallback();
    }, ["Tab"]);

    const tabCallback = () => {
        let tempIndex
        if (displayKeyIndex === null || displayKeyIndex === attributesList.length - 1) {
            tempIndex = 0
        } else {
            tempIndex = displayKeyIndex + 1
        }
        let keepGoing = true
        let i = 0;
        while (keepGoing && i < 100) {
            i+=1
            let tempKey = attributesList[tempIndex].key
            let tempVertices = attributesList[tempIndex].normalized_vertices
            if(tempVertices !== null && tempVertices !== undefined) {
                let isSubattribute = attributesList[tempIndex].isSubattribute
                let topLevelAttribute = attributesList[tempIndex].topLevelAttribute
                handleClickField(tempKey, tempVertices, isSubattribute, topLevelAttribute)

                // scroll down to attribute. if it is a sub attribute, we may have to wait for the drop down to open
                let scrollFactor = 5
                let waitTime = 0
                if (isSubattribute) waitTime = 150
                setTimeout(function() {
                    scrollToAttribute("table-container", (tempIndex / attributesList.length) * scrollFactor, isSubattribute)
                }, waitTime)
                keepGoing = false 
                let elementId
                if (isSubattribute) {
                    setForceOpenSubtable(topLevelAttribute)
                    elementId = `${topLevelAttribute}::${tempKey}`
                } else elementId = tempKey
                let element = document.getElementById(elementId)
                if (element) {
                    // element.scrollIntoView(true)
                    element.scroll({
                        top: 100,
                        left: 100,
                        behavior: "smooth",
                    });
                }
                // else console.log(elementId,"is null")
            }
            else {
                tempIndex+=1
                if (tempIndex === attributesList.length) tempIndex = 0
            }
        }
        
    }

    const handleClickField = (key, normalized_vertices, isSubattribute, topLevelAttribute) => {
        if(key === displayKey) {
            setDisplayPoints(null)
            setDisplayKey(null)
            setDisplayKeyIndex(null)
        }
        else if(normalized_vertices !== null && normalized_vertices !== undefined) {
            let percentage_vertices = []
            for (let each of normalized_vertices) {
                percentage_vertices.push([each[0]*100, each[1]*100])
            }
            setDisplayPoints(percentage_vertices)
            setDisplayKey(key)

            // set display key index
            let keepGoing = true
            let i = -1
            while (keepGoing && i < attributesList.length) {
                i++
                let tempAttr = attributesList[i]
                if (key === tempAttr.key) {
                    if (!isSubattribute) {
                        setDisplayKeyIndex(i)
                        keepGoing = false
                    } else if(isSubattribute && topLevelAttribute === tempAttr.topLevelAttribute) {
                        setDisplayKeyIndex(i)
                        keepGoing = false
                    }
                }
                
            }
            // scrollToAttribute("image-box", normalized_vertices[2][1] * 300)
            scrollToAttribute("image-box", normalized_vertices[2][1])
        }
    }

    const scrollToAttribute = (id, top) => {
        let imageContainerId = id
        let imageContainerElement = document.getElementById(imageContainerId)
        
        if (imageContainerElement) {
            imageContainerElement.scrollTo({
                top: top * imageContainerElement.clientHeight,
                // left: coordinates[1],
                behavior: "smooth",
                });
        }
    }


    const handleSetFullscreen = (item) => {
        if (fullscreen === item)  {
            setGridWidths([5.9,0.2,5.9])
            setFullscreen(null)
        }
        else { 
            setFullscreen(item)
            if (item === "image") setGridWidths([12, 0, 0])
            else if (item === "table") setGridWidths([0, 0, 12])
        }
    }

    return (
        <Box>
            <Grid container>
                {
                    fullscreen !== "image" && 
                    <Grid item xs={gridWidths[2]}>
                        <Box sx={styles.gridContainer}>
                            <Box sx={styles.containerActions}>
                                <IconButton onClick={() => handleSetFullscreen("table")}>
                                    { 
                                        fullscreen === "table" ? <FullscreenExitIcon/> : <FullscreenIcon/> 
                                    }
                                </IconButton>
                            </Box>
                            {attributes !== undefined && 
                                <AttributesTable 
                                    attributes={attributes}
                                    handleClickField={handleClickField}
                                    handleChangeValue={handleChangeValue}
                                    fullscreen={fullscreen}
                                    displayKey={displayKey}
                                    forceOpenSubtable={forceOpenSubtable}
                                    attributesList={attributesList}
                                    displayKeyIndex={displayKeyIndex}
                                />
                            }
                        </Box>
                    </Grid>
                }
                <Grid item xs={gridWidths[1]}></Grid>
                {fullscreen !== "table" && 
                    <Grid item xs={gridWidths[0]}>
                        <Box sx={styles.gridContainer}>
                            <Box sx={styles.containerActions}>
                                <IconButton onClick={() => handleSetFullscreen("image")}>
                                    { 
                                        fullscreen === "image" ? <FullscreenExitIcon/> : <FullscreenIcon/> 
                                    }
                                </IconButton>
                            </Box>
                            <Box id="image-box" sx={styles.imageBox}>
                                
                                {image !== undefined &&
                                <div style={imageDivStyle}>
                                    <ImageCropper 
                                        image={image}
                                        displayPoints={displayPoints}
                                        disabled
                                        fullscreen={fullscreen}
                                    />
                                </div>
                                }
                            </Box>
                        </Box>
                    </Grid>
                }
                
            </Grid>
        </Box>

    );

}

function AttributesTable(props) {
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
        <TableRow key={k} id={`${k}`}>
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