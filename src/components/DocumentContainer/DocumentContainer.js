import { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableRow, TableContainer } from '@mui/material';
import { Grid, Box, TextField, Collapse, Typography, IconButton } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import LassoSelector from '../../components/LassoSelector/LassoSelector';
import { ImageCropper } from '../ImageCropper/ImageCropper';
import { formatConfidence } from '../../assets/helperFunctions';

const styles = {
    imageBox: {
        height: "90vh",
        overflowY: "scroll",
        position: "relative"
    },
    image: {
        height: "75vh"
    },
    fieldsTable: {
        width: "100%",
        maxHeight: "90vh",
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
    },
}

export default function DocumentContainer(props) {
    const { image, attributes, handleChangeValue } = props;
    const [ displayPoints, setDisplayPoints ] = useState(null)
    const [ displayKey, setDisplayKey ] = useState(null)
    const [ imageDimensions, setImageDimensions ] = useState([])
    const [ checkAgain, setCheckAgain ] = useState(0)
    const [ fullscreen, setFullscreen ] = useState(null)
    const [ gridWidths, setGridWidths ] = useState([5.9,0.2,5.9])

    useEffect(() => {
        // console.log(props)
        if (image !== undefined) {
            let img = new Image();
            img.src = image
            
            // for some reason image dimensions arent accessible for a half a second or so
            if (img.width === 0) {
                setTimeout(function() {
                    setCheckAgain(checkAgain+1)
                }, 500)
                
            } else {
                let tempImageDimensions = [img.width, img.height]
                setImageDimensions(tempImageDimensions)
            }
        }
    }, [image, checkAgain])

    const handleClickField = (key, normalized_vertices) => {
        if(key === displayKey) {
            setDisplayPoints(null)
            setDisplayKey(null)
        }
        else if(normalized_vertices !== null && normalized_vertices !== undefined) {
            let actual_vertices = []
            let percentage_vertices = []
            for (let each of normalized_vertices) {
                // actual_vertices.push([each[0]*imageDimensions[0], each[1]*imageDimensions[1]])
                percentage_vertices.push([each[0]*100, each[1]*100])
            }
            setDisplayPoints(percentage_vertices)
            setDisplayKey(key)
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
                            <Box sx={styles.imageBox}>
                                {image !== undefined && 
                                // <LassoSelector 
                                //     image={image}
                                //     displayPoints={displayPoints}
                                //     disabled
                                //     fullscreen={fullscreen}
                                // />
                                    <ImageCropper 
                                        image={image}
                                        displayPoints={displayPoints}
                                        disabled
                                        fullscreen={fullscreen}
                                    />
                                }
                            </Box>
                        </Box>
                    </Grid>
                }
                
                <Grid item xs={gridWidths[1]}></Grid>
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
                                />
                            }
                        </Box>
                    </Grid>
                }
                
            </Grid>
        </Box>

    );

}

function AttributesTable(props) {
    const { attributes, handleClickField, handleChangeValue, fullscreen } = props

    return (
        <TableContainer sx={styles.fieldsTable}>
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
                        />
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}

function AttributeRow(props) { 
    const { k, v, handleClickField, handleChangeValue, fullscreen } = props
    const [ editMode, setEditMode ] = useState(false)
    const [ openSubtable, setOpenSubtable ] = useState(false)

    const handleDoubleClick = () => {
        setEditMode(true)
    }

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            setEditMode(false)
        } 
      }

    return (
    <>
        <TableRow key={k}>
            <TableCell sx={styles.fieldKey}>
                
                <span onClick={() => handleClickField(k, v.normalized_vertices)}>
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
                v.subattributes ? <TableCell/> :
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
            />
        }
    </>
    )
}

function SubattributesTable(props) {
    const { attributes, handleClickField, handleChangeValue, open, topLevelAttribute, fullscreen } = props

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
    const { k, v, handleClickField, handleChangeValue, topLevelAttribute, fullscreen } = props
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
        <TableRow key={k}>
            <TableCell sx={styles.fieldKey} onClick={() => handleClickField(k, v.normalized_vertices)}>{k}</TableCell>
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