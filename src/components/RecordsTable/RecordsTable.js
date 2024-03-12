import { useEffect, Fragment } from 'react';
import { useNavigate } from "react-router-dom";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Box, Paper } from '@mui/material'
import { DNA } from 'react-loader-spinner'
import DownloadIcon from '@mui/icons-material/Download';
import { downloadRecordsCSV } from '../../services/app.service';
import { formatDate, callAPIWithBlobResponse } from '../../assets/helperFunctions';

const TABLE_ATTRIBUTES = {
  displayNames: ["Record Name", "Contributor", "Date Uploaded", "Digitization Status", "Review Status"],
  keyNames: ["name", "contributor", "dateCreated", "status", "review_status"],
  // "Record Name": "name", 
  // "Contributor": "contributor",
  // "Date Uploaded": "dateCreated",
  // "Digitization Status": "status",
  // "Review Status": "review_status"
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

  const tableRow = (row, idx) => {
    // if (row.attributes === undefined) {
    //   return (
    //     <TableRow
    //       sx={styles.projectRow}
    //       onClick={() => handleClickRecord(row._id)}
    //     >
    //       <TableCell align="center" colSpan={TABLE_ATTRIBUTES.displayNames.length} sx={{padding:0, position: "relative"}}>
    //         {/* <span style={{position: "absolute", top:"25%", right: "54%"}}>processing</span> */}
    //         <DNA
    //           style={{margin: 0, padding: 0}}
    //           visible={true}
    //           height="50"
    //           width="80"
    //           ariaLabel="dna-loading"
    //         />
    //       </TableCell>
    //     </TableRow>
    //   )
    // } else {
      return (
        <TableRow
          sx={styles.projectRow}
          onClick={() => handleClickRecord(row._id)}
        >
            <TableCell>{row.name}</TableCell>
            <TableCell>{row.contributor.name}</TableCell>
            <TableCell>{formatDate(row.dateCreated)}</TableCell>
            <TableCell>{row.status}</TableCell>
            <TableCell>{row.review_status}</TableCell>
        </TableRow>
      )
    // }
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
                    <TableCell sx={styles.headerCell} key={idx}>{attribute}</TableCell>
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