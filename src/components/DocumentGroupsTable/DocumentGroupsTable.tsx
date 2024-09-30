import { useNavigate } from "react-router-dom";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { formatDate } from '../../assets/helperFunctions';
import { ProjectData, DocumentGroup } from "../../types";
import { styles } from "../../assets/styles";

interface DocumentGroupsTableProps {
  document_groups: DocumentGroup[];
}

const DocumentGroupsTable = ({ document_groups }: DocumentGroupsTableProps) => {
  const navigate = useNavigate();

  const handleClickDocumentGroup = (dg_id: string) => {
    navigate("/document_group/" + dg_id);
  }
  
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="Document Groups table">
        <TableHead>
          <TableRow>
            {["Document Group Name", "Description", "Document Type", "Locations", "Creator", "Date"].map((value: string) => (
              <TableCell sx={styles.headerRow} key={value}>{value}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {document_groups.map((row: ProjectData, idx: number) => (
            <TableRow
              key={row.name + " " + idx}
              sx={styles.tableRow}
              onClick={() => handleClickDocumentGroup(row._id)}
              id={row.name.replaceAll(" ", "")+"_document_group_row"}
              className="document_group_row"
            >
              <TableCell component="th" scope="row">
                {row.name}
              </TableCell>
              <TableCell>{row.description}</TableCell>
              <TableCell>{row.documentType}</TableCell>
              <TableCell>{row.state}</TableCell>
              <TableCell>{row.creator?.name || ""}</TableCell>
              <TableCell>{formatDate(row.dateCreated || null)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default DocumentGroupsTable;