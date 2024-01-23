import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

export default function ProjectsListTable(props) {
  const { projects } = props;

  const styles = {
    projectRow: {
      cursor: "pointer",
      
    }
  }

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="projects table">
        <TableHead>
          <TableRow>
            <TableCell>Project Name</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Records Categories</TableCell>
            <TableCell>Locations</TableCell>
            <TableCell>Attributes</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {projects.map((row) => (
            <TableRow
              key={row.name}
              sx={styles.projectRow}
            >
              <TableCell component="th" scope="row">
                {row.name}
              </TableCell>
              <TableCell>{row.description}</TableCell>
              <TableCell>{row.categories}</TableCell>
              <TableCell>{row.state}</TableCell>
              <TableCell>{row.attributes}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}