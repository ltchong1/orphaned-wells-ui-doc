import React, { useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from '@mui/material'
import Paper from '@mui/material/Paper';

export default function RecordsTable(props) {
  let navigate = useNavigate()
  const { records, attributes } = props;

  useEffect(() => {

  },[props])

  const styles = {
    projectRow: {
      cursor: "pointer",
      "&:hover": {
        background: "#efefef"
      },
    }
  }

  const handleClickRecord = (record_id) => {
    navigate("/record/" + record_id)
  }

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="records table">
        <TableHead>
          <TableRow>
            {
                attributes.map((attribute, idx) => (
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
              // onClick={() => handleClickRecord(row._id)}
            >
                {attributes.map((attribute, attribute_idx) => {
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