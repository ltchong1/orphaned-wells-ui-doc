import * as React from 'react';
import { useNavigate } from "react-router-dom";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from '@mui/material'
import Paper from '@mui/material/Paper';
import { formatDate } from '../../assets/helperFunctions';

export default function ProjectsListTable(props) {
  let navigate = useNavigate()
  const { projects } = props;

  const styles = {
    headerRow: {
      fontWeight: "bold"
    },
    projectRow: {
      cursor: "pointer",
      "&:hover": {
        background: "#efefef"
      },
    }
  }

  const handleClickProject = (project_id) => {
    navigate("/project/" + project_id)
  }

  const formatAttributes = (attributes) => {
    let output = ""
    for (let attribute of attributes) {
      output += attribute+", "
    }
    output = output.substring(0, output.length-2)
    return output
  }

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="projects table">
        <TableHead>
          <TableRow>
            {["Project Name", "Description", "Document Type", "Locations", "Date"].map((value)=>(
              <TableCell sx={styles.headerRow} key={value}>{value}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {projects.map((row) => (
            <TableRow
              key={row.name}
              sx={styles.projectRow}
              onClick={() => handleClickProject(row.id_)}
            >
              <TableCell component="th" scope="row">
                {row.name}
              </TableCell>
              <TableCell>{row.description}</TableCell>
              <TableCell>{row.documentType}</TableCell>
              <TableCell>{row.state}</TableCell>
              <TableCell>{formatDate(row.dateCreated)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}