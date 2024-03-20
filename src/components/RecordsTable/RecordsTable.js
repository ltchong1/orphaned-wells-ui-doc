import { useEffect, Fragment } from 'react';
import { useNavigate } from "react-router-dom";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Box, Paper, IconButton } from '@mui/material'
import { DNA } from 'react-loader-spinner'
import DownloadIcon from '@mui/icons-material/Download';
import ErrorIcon from '@mui/icons-material/Error';
import CachedIcon from '@mui/icons-material/Cached';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { downloadRecordsCSV } from '../../services/app.service';
import { formatDate, callAPIWithBlobResponse, median, average, formatConfidence } from '../../assets/helperFunctions';

const TABLE_ATTRIBUTES = {
  displayNames: ["Record Name", "Contributor", "Date Uploaded", "API Number", "Average Confidence", "Digitization Status", "Review Status"],
  keyNames: ["name", "contributor", "dateCreated", "API_NUMBER", "confidence_median", "confidence_lowest", "status", "review_status"],
}

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
    },
    headerCell: {
      fontWeight: "bold"
    },
  }

  const handleClickRecord = (record_id) => {
    navigate("/record/" + record_id)
  }

  const handleDownloadCSV = () => {
    callAPIWithBlobResponse(
      downloadRecordsCSV,
      [projectData.id_],
      handleSuccess,
      (e) => console.error("unable to download csv: "+e)
    )
  }

  const handleSuccess = (data) => {
    const href = window.URL.createObjectURL(data);
    const link = document.createElement('a');
    link.href = href;
    link.setAttribute('download', `${projectData.name}_records.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  const calculateAverageConfidence = (attributes) => {
    let confidences = []
    for (let key of Object.keys(attributes)) {
      let attr = attributes[key]
      confidences.push(attr.confidence)
    }
    return formatConfidence(average(confidences))
  }

  const tableRow = (row, idx) => {
      return (
        <TableRow
          sx={styles.projectRow}
          onClick={() => handleClickRecord(row._id)}
        >
            <TableCell>{row.recordIndex}. {row.name}</TableCell>
            <TableCell>{row.contributor.name}</TableCell>
            <TableCell>{formatDate(row.dateCreated)}</TableCell>
            <TableCell align="right">{row.attributes.API_NUMBER.value}</TableCell>
            <TableCell align="right">{calculateAverageConfidence(row.attributes)}</TableCell>
            {/* <TableCell>{calculateLowestConfidence(row.attributes)}</TableCell> */}
            <TableCell align="right">
              {
                row.status === "processing" ? 
                <IconButton>
                  <CachedIcon sx={{color: "#EF6C0B"}} /> 
                </IconButton> :
                row.status === "digitized" ? 
                <IconButton>
                  <CheckCircleOutlineIcon sx={{color: "green"}}/>
                </IconButton> :
                null
              }
              {row.status}
            </TableCell>
            <TableCell align="right">
              {
                row.review_status === "unreviewed" ? 
                <IconButton >
                  <ErrorIcon /> 
                </IconButton> :
                row.review_status === "reviewed" ? 
                <IconButton>
                  <CheckCircleIcon sx={{color: "green"}}/> 
                </IconButton> :
                null
              }
              {row.review_status}
            </TableCell>
        </TableRow>
      )
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
                TABLE_ATTRIBUTES.displayNames.map((attribute, idx) => (
                    <TableCell sx={styles.headerCell} key={idx} align={idx > 2 ? "right" : "left"}>{attribute}</TableCell>
                ))
            }
          </TableRow>
        </TableHead>
        <TableBody>
          {records.map((row, idx) => (
            <Fragment key={idx}>
              {tableRow(row, idx)}
            </Fragment>
            
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}