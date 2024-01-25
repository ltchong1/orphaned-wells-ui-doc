import * as React from 'react';
import { useNavigate } from "react-router-dom";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from '@mui/material'
import Paper from '@mui/material/Paper';

export default function RecordsTable(props) {
  let navigate = useNavigate()
  const { records, attributes } = props;

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
              onClick={() => handleClickRecord(row._id)}
            >
                {attributes.map((attribute, attribute_idx) => (
                    <TableCell key={attribute_idx}>{row[attribute]}</TableCell>
                ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}