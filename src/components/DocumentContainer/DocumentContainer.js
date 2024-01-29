import React, { useState, useEffect } from 'react';
import { Grid, Box, Table, TableBody, TableCell, TableHead, TableRow, TableContainer } from '@mui/material';
// import LassoSelector from '../../components/LassoSelector/LassoSelector';

export default function DocumentContainer(props) {
    const { image, attributes } = props;
    const [ showFieldNameModal, setShowFieldNameModal ] = useState(false)
    const [ points, setPoints ] = useState(null)
    const [ displayPoints, setDisplayPoints ] = useState(null)
    const [ showCompletedPoints, setShowCompletedPoints ] = useState(true)

    useEffect(() => {
        console.log(props)
    }, [props])

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
            maxHeight: "80vh",
        },
        tableHead: {
            backgroundColor: "#EDF2FA",
            fontWeight: "bold",
            
        }
    }

    const handleUpdatePoints = (newPoints) => {
        console.log('got points: ')
        console.log(newPoints)
        if (newPoints.length === 4 && showCompletedPoints) {
            setPoints(newPoints)
            setShowFieldNameModal(true)
        }
    }


    const handleShowFieldCoordinates = (coords) => {
        console.log('show coords: ')
        console.log(coords)
        setDisplayPoints(coords)
    }

    return (
        <Box>
            <Grid container>
                <Grid item xs={6}>
                    {image !== undefined && 
                    // <LassoSelector 
                    //     image={image} 
                    //     handleUpdatePoints={handleUpdatePoints} 
                    //     displayPoints={displayPoints} 
                    //     setShowCompletedPoints={setShowCompletedPoints}
                    // />
                    <img style={styles.image} src={image}></img>
                    }
                </Grid>
                <Grid item xs={6}>
                    {attributes !== undefined && 
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
                                    <TableRow key={k}>
                                        <TableCell>{k}</TableCell>
                                        <TableCell>{v.value}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    }
                </Grid>
            </Grid>
        </Box>

    );

}