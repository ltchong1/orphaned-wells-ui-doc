import React, { useState, useEffect } from 'react';
import FileUploadModal from '../../components/FileUploadModal/FileUploadModal';
import PopupModal from '../../components/PopupModal/PopupModal';
import { Grid, Box, Button, Table, TableBody, TableCell, TableHead, TableRow, TableContainer, Collapse, IconButton } from '@mui/material';
import { FormControl, Select, InputLabel, MenuItem } from '@mui/material';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import LassoSelector from '../../components/LassoSelector/LassoSelector';
import { getTokens, processImage, getFields } from '../../services/app.service';

export default function Home(props) {
    const [ showModal, setShowModal ] = useState(false)
    const [ showParsedFields, setShowParsedFields ] = useState(false)
    const [ imageFile, setImageFile ] = useState(null)
    const [ image, setImage ] = useState(null)
    const [ tokensFound, setTokensFound ] = useState(null)
    const [ allFields, setAllFields ] = useState(null)
    const [ customFields, setCustomFields ] = useState({})
    const [ showFieldNameModal, setShowFieldNameModal ] = useState(false)
    const [ points, setPoints ] = useState(null)
    const [ customFieldName, setCustomFieldName ] = useState('')
    const [ displayPoints, setDisplayPoints ] = useState(null)
    const [ showCompletedPoints, setShowCompletedPoints ] = useState(true)

    const styles = {
        imageBox: {
            maxHeight: '500px'
        },
        fieldsTable: {
            // p: 5,
            marginLeft: 10,
            marginTop: 10,
            width: "80%",
            maxHeight: "80vh",
        },
        tableHead: {
            backgroundColor: "#EDF2FA",
            fontWeight: "bold",
            
        }
    }

    const handleUploadFile = (file) => {
        // console.log('uploading file: '+file)
        const formData = new FormData();
        formData.append('file', file, file.name);
        processImage(formData)
        .then(response => {
            if (response.status === 200) {
                response.blob()
                .then((data)=>{
                    // console.log('image upload successful: ',data)
                    setImage(URL.createObjectURL(data));
                    setShowModal(false)
                    
                    getFields().then(response => {
                        if(response.status === 200) response.json().then((data)=> {
                            console.log('custom fields found: ')
                            console.log(data.customFields)
                            setCustomFields(data.customFields)
                            setAllFields(data.fields)
                            setTokensFound(null)
                        })
                    })
                    // setAllFields(data.fields)
                }).catch((err)=>{
                    console.error("error on image upload: ",err)
                })
            }
            else if (response.status === 400) {
                console.error("error on file upload: ",response.statusText)
            }
        })
        
    }

    const handleUpdatePoints = (newPoints) => {
        console.log('got points: ')
        console.log(newPoints)
        if (newPoints.length === 4 && showCompletedPoints) {
            setPoints(newPoints)
            setShowFieldNameModal(true)
            // getTokens({'points': points})
            //   .then(response => response.json())
            //   .then((data) => {
            //     console.log('response from points ')
            //     console.log(data)
            //     setTokensFound(data.tokens_found)
            //   }).catch(e => {
            //     console.error('error on fetching points')
            //     console.error(e)
            //   })
        }
    }

    const handleSearchTokens = () => {
        setShowFieldNameModal(false)
        setCustomFieldName("")
        // console.log('searching for tokens inside coordinates:')
        // console.log(points)
        getTokens({'points': points, field_name: customFieldName})
              .then(response => response.json())
              .then((data) => {
                console.log('response from points ')
                console.log(data)
                setTokensFound(data.tokens_found)
                if (customFieldName!=='') setCustomFields(data.customFields)
              }).catch(e => {
                console.error('error on fetching points')
                console.error(e)
              })
    }

    const handleEditCustomFieldName = (event) => {
        setCustomFieldName(event.target.value)
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
                    <Button
                        onClick={()=>setShowModal(true)}
                    >
                        Upload image file
                    </Button>
                    {showModal && 
                        <FileUploadModal
                            setShowFileModal={setShowModal}
                            handleUpload={handleUploadFile}
                        />
                    }
                    {image !== null && 
                        <Box> 
                            {/* <div>
                                <img alt="uploaded image" src={image}/>
                            </div> */}
                            <LassoSelector image={image} handleUpdatePoints={handleUpdatePoints} displayPoints={displayPoints} setShowCompletedPoints={setShowCompletedPoints}/>
                        </Box>
                    }
                    {tokensFound !== null && 
                        <Box> 
                            <p>
                                found the following tokens: &nbsp;&nbsp;
                                {
                                    tokensFound.map((v,i) => (
                                        <b key={i}>{v}&nbsp;</b>
                                    ))
                                }
                            </p>
                        </Box>
                }
                </Grid>
                <Grid item xs={6}>

                    {Object.keys(customFields).length > 0 &&
                    <TableContainer sx={styles.fieldsTable}>
                        <Table>
                            <TableHead sx={styles.tableHead}>
                                <TableRow>
                                    <TableCell>Custom Field</TableCell>
                                    <TableCell>Method</TableCell>
                                    <TableCell>Value</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {Object.entries(customFields).map(([k, v]) => (
                                    // <TableRow key={k} onClick={() => handleShowFieldCoordinates(v.search_coordinates)}>
                                    //     <TableCell>{k}</TableCell>
                                    //     <TableCell>{v.tokens}</TableCell>
                                    // </TableRow>
                                    <CustomFieldRow k={k} v={v} handleShowFieldCoordinates={handleShowFieldCoordinates}/>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    }

                    {allFields !== null && 
                    <TableContainer sx={styles.fieldsTable}>
                        <Box sx={{display: 'flex', justifyContent: 'flex-start', marginLeft:'40px'}}>
                            <p style={styles.advancedOptions}>
                                Show Goole Form Parsed Fields
                                <IconButton onClick={() => setShowParsedFields(!showParsedFields)}>{showParsedFields ? <ExpandLess /> : <ExpandMore />}</IconButton>
                            </p>
                        </Box>
                        <Collapse in={showParsedFields} timeout="auto" unmountOnExit>
                            
                            <Table>
                                <TableHead sx={styles.tableHead}>
                                    <TableRow>
                                        <TableCell>Field</TableCell>
                                        <TableCell>Value</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {Object.entries(allFields).map(([k, v]) => (
                                        <TableRow key={k}>
                                            <TableCell>{k}</TableCell>
                                            <TableCell>{v}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Collapse>
                    </TableContainer>
                    }
                    
                </Grid>
            </Grid>
            <PopupModal
                open={showFieldNameModal}
                handleClose={() => setShowFieldNameModal(false)}
                text="Would you like to name and save this field?"
                handleSave={handleSearchTokens}
                buttonText='Add'
                buttonColor='primary'
                buttonVariant='contained'
                input4
                width={400}
            />
            <PopupModal
                input
                open={showFieldNameModal}
                handleClose={() => setShowFieldNameModal(false)}
                text={customFieldName}
                textLabel='Optional: add name to save this field location.'
                handleEditText={handleEditCustomFieldName}
                handleSave={handleSearchTokens}
                buttonText='Submit'
                buttonColor='primary'
                buttonVariant='contained'
                width={400}
            />
        </Box>
        
    );

}


function CustomFieldRow(props) {
    const { k, v, handleShowFieldCoordinates } = props;
    const [ key, setKey ] = useState('original')
    // useEffect(() => {
    //     console.log('use effect ')
    //     console.log(k)
    //     console.log(v)
    // }, [props])

    const handleSelectField = (event) => {
        setKey(event.target.value)
    }

    return (
        <TableRow key={k+v[key]}>
            <TableCell>{k}</TableCell>
            <TableCell>
                <FormControl fullWidth>
                <InputLabel id="customfieldselect-label">Method</InputLabel>
                <Select
                    labelId="customfieldselect-label"
                    id="customfieldselect"
                    value={key}
                    label="Age"
                    onChange={handleSelectField}
                >
                    {Object.entries(v).map(([ke,va]) => (
                        <MenuItem value={ke}>{ke}</MenuItem>
                    ))}
                </Select>
                </FormControl>
            </TableCell>
            <TableCell onClick={() => handleShowFieldCoordinates(v[key].search_coordinates)}>{v[key].tokens}</TableCell>
        </TableRow>
    )
}