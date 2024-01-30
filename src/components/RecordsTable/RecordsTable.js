import React, { useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Box, Paper } from '@mui/material'
import DownloadIcon from '@mui/icons-material/Download';
import { downloadRecordsCSV } from '../../services/app.service';

export default function RecordsTable(props) {
  let navigate = useNavigate()
  const { projectData, records } = props;

  useEffect(() => {

  },[props])

  const styles = {
    projectRow: {
      cursor: "pointer",
      "&:hover": {
        background: "#efefef"
      },
    },
    topSection: {
      display: 'flex', 
      justifyContent: 'flex-end', 
      marginTop: 2, 
      marginRight: 2
    }
  }

  const handleClickRecord = (record_id) => {
    navigate("/record/" + record_id)
  }

  const handleDownloadCSV = () => {
    downloadRecordsCSV(projectData.id_)
    .then(response => response.blob())
    .then((data)=>{
        const href = window.URL.createObjectURL(data);
        const link = document.createElement('a');
        link.href = href;
        link.setAttribute('download', `${projectData.name}_records.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });
  }

  return (
    <TableContainer component={Paper}>
      <Box sx={styles.topSection}>
        <Button variant="contained" onClick={handleDownloadCSV} startIcon={<DownloadIcon/>}>
          Download csv
        </Button>
      </Box>
      <Table sx={{ minWidth: 650 }} aria-label="records table">
        <TableHead>
          <TableRow>
            {
                projectData.attributes.map((attribute, idx) => (
                    <TableCell key={idx}>{attribute}</TableCell>
                ))
            }
          </TableRow>
        </TableHead>
        <TableBody>
          {records.map((row, idx) => (
            <TableRow
              key={idx}
              sx={styles.projectRow}
              onClick={() => handleClickRecord(row._id)}
            >
                {projectData.attributes.map((attribute, attribute_idx) => {
                  try {
                    if (Object.keys(row.attributes).includes(attribute)) {
                      return <TableCell key={attribute_idx}>{row.attributes[attribute].value}</TableCell>
                    } else return <TableCell key={attribute_idx}>N/A</TableCell>
                  } catch (e) {
                    return <TableCell key={attribute_idx}>error</TableCell>
                  }                  
                })}
                {/* {Object.entries(row.attributes).map(([key, attribute]) => (
                  <TableCell key={key}>{attribute.raw_text}</TableCell>
                ))} */}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}