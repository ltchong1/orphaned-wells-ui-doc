import { useState, useEffect } from 'react';
import { Grid, Box, Table, TableBody, TableCell, TableHead, TableRow, TableContainer, TextField } from '@mui/material';
import LassoSelector from '../../components/LassoSelector/LassoSelector';

const styles = {
    imageBox: {
        // maxHeight: '500px'
    },
    image: {
        height: "75vh"
    },
    fieldsTable: {
        // marginLeft: 10,
        // marginTop: 10,
        width: "80%",
        maxHeight: "70vh",
        // padding: 10
    },
    tableHead: {
        backgroundColor: "#EDF2FA",
        fontWeight: "bold",
    }, 
    fieldKey: {
        cursor: "pointer",
    }
}

export default function DocumentContainer(props) {
    const { image, attributes, handleChangeValue } = props;
    const [ displayPoints, setDisplayPoints ] = useState(null)
    const [ displayKey, setDisplayKey ] = useState(null)
    const [ imageDimensions, setImageDimensions ] = useState([])
    const [ checkAgain, setCheckAgain ] = useState(0)

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
            setDisplayPoints([])
            setDisplayKey(null)
        }
        else if(normalized_vertices !== null && normalized_vertices !== undefined) {
            let actual_vertices = []
            for (let each of normalized_vertices) {
                actual_vertices.push([each[0]*imageDimensions[0], each[1]*imageDimensions[1]])
            }
            setDisplayPoints(actual_vertices)
            setDisplayKey(key)
        }
    }

    return (
        <Box>
            <Grid container>
                <Grid item xs={6}>
                    {image !== undefined && 
                    <LassoSelector 
                        image={image}
                        displayPoints={displayPoints}
                        disabled
                    />
                    }
                </Grid>
                <Grid item xs={6}>
                    {attributes !== undefined && 
                        <AttributesTable 
                            attributes={attributes}
                            handleClickField={handleClickField}
                            handleChangeValue={handleChangeValue}
                        />
                    }
                </Grid>
            </Grid>
        </Box>

    );

}

function AttributesTable(props) {
    const { attributes, handleClickField, handleChangeValue } = props


    return (
        <TableContainer sx={styles.fieldsTable}>
            <Table>
                <TableHead sx={styles.tableHead}>
                    <TableRow>
                        <TableCell>Field</TableCell>
                        <TableCell>Value</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {Object.entries(attributes).map(([k, v]) => (
                        <AttributeRow 
                            k={k}
                            v={v}
                            handleClickField={handleClickField}
                            handleChangeValue={handleChangeValue}
                        />
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}

function AttributeRow(props) { 
    const { k, v, handleClickField, handleChangeValue } = props
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
                        onChange={handleChangeValue} 
                        onFocus={(event) => event.target.select()}
                    />
                    :
                    v.value
                }
            </TableCell>
        </TableRow>
    )
}