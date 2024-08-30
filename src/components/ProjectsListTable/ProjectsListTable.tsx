import { useNavigate } from "react-router-dom";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { formatDate } from '../../assets/helperFunctions';
import { FC } from 'react';

interface Project {
  id_: string;
  name: string;
  description: string;
  documentType: string;
  state: string;
  creator: {
    name: string;
  };
  dateCreated: number;
}

interface ProjectsListTableProps {
  projects: Project[];
}

const ProjectsListTable: FC<ProjectsListTableProps> = (props) => {
  const navigate = useNavigate();
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

  const handleClickProject = (project_id: string): void => {
    navigate("/project/" + project_id);
  }
  
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="projects table">
        <TableHead>
          <TableRow>
            {["Project Name", "Description", "Document Type", "Locations", "Creator", "Date"].map((value: string) => (
              <TableCell sx={styles.headerRow} key={value}>{value}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {projects.map((row: Project, idx: number) => (
            <TableRow
              key={row.name + " " + idx}
              sx={styles.projectRow}
              onClick={() => handleClickProject(row.id_)}
            >
              <TableCell component="th" scope="row">
                {row.name}
              </TableCell>
              <TableCell>{row.description}</TableCell>
              <TableCell>{row.documentType}</TableCell>
              <TableCell>{row.state}</TableCell>
              <TableCell>{row.creator.name}</TableCell>
              <TableCell>{formatDate(row.dateCreated)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default ProjectsListTable;