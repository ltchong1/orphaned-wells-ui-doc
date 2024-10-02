import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import { useParams, useNavigate } from "react-router-dom";
import { getRecordGroup, uploadDocument, deleteRecordGroup, updateRecordGroup } from '../../services/app.service';
import RecordsTable from '../../components/RecordsTable/RecordsTable';
import Subheader from '../../components/Subheader/Subheader';
import UploadDocumentsModal from '../../components/UploadDocumentsModal/UploadDocumentsModal';
import PopupModal from '../../components/PopupModal/PopupModal';
import { callAPI } from '../../assets/helperFunctions';
import { convertFiltersToMongoFormat } from '../../assets/helperFunctions';
import { RecordGroup, ProjectData, PreviousPages } from '../../types';
import ColumnSelectDialog from '../../components/ColumnSelectDialog/ColumnSelectDialog';

const RecordGroupPage = () => {
    const params = useParams<{ id: string }>(); 
    const navigate = useNavigate();
    const [project, setProject] = useState({} as ProjectData)
    const [records, setRecords] = useState<any[]>([]);
    const [recordGroup, setRecordGroup] = useState<RecordGroup>({ } as RecordGroup);
    const [showDocumentModal, setShowDocumentModal] = useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [openUpdateNameModal, setOpenUpdateNameModal] = useState(false);
    const [recordGroupName, setRecordGroupName] = useState("");
    const [recordCount, setRecordCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize, setPageSize] = useState(100);
    const [sortBy, setSortBy] = useState('dateCreated');
    const [sortAscending, setSortAscending] = useState(1);
    const [ openColumnSelect, setOpenColumnSelect ] = useState(false);
    const [navigation, setNavigation] = useState<PreviousPages>({"Projects": () => navigate("/projects", { replace: true })})
    const [filterBy, setFilterBy] = useState<any[]>(
            JSON.parse(localStorage.getItem("appliedFilters") || '{}')[params.id || ""] || []
    );

    useEffect(() => {
        loadData();
    }, [params.id, pageSize, currentPage, sortBy, sortAscending, filterBy]);

    useEffect(() => {
        setCurrentPage(0);
    }, [sortBy, sortAscending, filterBy]);

    useEffect(() => {
        let temp_navigation: PreviousPages = { 
            "Projects": () => navigate("/projects", { replace: true })
        }
        temp_navigation[project.name] = () => navigate("/project/"+project._id, { replace: true })
        setNavigation(temp_navigation)
    }, [project]);

    const loadData = () => {
        const sort: [string, number] = [sortBy, sortAscending];
        const args: [string, number, number, [string, number], any] = [params.id || "", currentPage, pageSize, sort, convertFiltersToMongoFormat(filterBy)];
        callAPI(
            getRecordGroup,
            args,
            handleSuccess,
            (e: Error) => { console.error('error getting record group data: ', e); }
        );
    };

    const handleSuccess = (data: { records: any[], rg_data: RecordGroup, record_count: number, project: ProjectData }) => {
        setRecords(data.records);
        setRecordGroup(data.rg_data);
        setRecordGroupName(data.rg_data.name);
        setRecordCount(data.record_count);
        setProject(data.project)
    };

    const styles = {
        outerBox: {
            backgroundColor: "#F5F5F6",
            height: "100vh"
        },
        innerBox: {
            paddingY: 5,
            paddingX: 5,
        },
    };

    const handleUploadDocument = (file: File) => {
        const formData = new FormData();
        formData.append('file', file, file.name);
        callAPI(
            uploadDocument,
            [formData, recordGroup._id],
            handleSuccessfulDocumentUpload,
            (e: Error) => { console.error('error on file upload: ', e); }
        );
    };

    const handleSuccessfulDocumentUpload = () => {
        setTimeout(() => {
            window.location.reload();
        }, 500);
    };

    const handleClickChangeName = () => {
        setOpenUpdateNameModal(true);
    };

    const handleDeleteRecordGroup = () => {
        setOpenDeleteModal(false);
        callAPI(
            deleteRecordGroup,
            [recordGroup._id],
            (data: any) => navigate("/project/"+project._id, { replace: true }),
            (e: Error) => { console.error('error on deleting record group: ', e); }
        );
    };

    const handleChangeRecordGroupName = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRecordGroupName(event.target.value);
    };

    const handleUpdateRecordGroupName = () => {
        setOpenUpdateNameModal(false);
        callAPI(
            updateRecordGroup,
            [params.id, { name: recordGroupName }],
            (data: any) => window.location.reload(),
            (e: Error) => console.error('error on updating record group name: ', e)
        );
    };

    const handleUpdateRecordGroup = (update: any) => {
        callAPI(
            updateRecordGroup,
            [params.id, update],
            (data: RecordGroup) => setRecordGroup(data),
            (e: Error) => console.error('error on updating record group name: ', e)
        );
    };

    const handleApplyFilters = (appliedFilters: any) => {
        setFilterBy(appliedFilters);
        let newAppliedFilters;
        let currentAppliedFilters = localStorage.getItem("appliedFilters");
        if (currentAppliedFilters === null) newAppliedFilters = {};
        else newAppliedFilters = JSON.parse(currentAppliedFilters);
        newAppliedFilters[recordGroup._id || ""] = appliedFilters;
        localStorage.setItem("appliedFilters", JSON.stringify(newAppliedFilters));
      }

    return (
        <Box sx={styles.outerBox}>
            <Subheader
                currentPage={recordGroup.name}
                buttonName="Upload new record(s)"
                handleClickButton={() => setShowDocumentModal(true)}
                actions={(localStorage.getItem("role") && localStorage.getItem("role") === "10") ?
                    {
                        "Change record group name": handleClickChangeName, 
                        "Delete record group": () => setOpenDeleteModal(true),
                    }
                    :
                    {
                        "Change record group name": handleClickChangeName, 
                    }
                }
                previousPages={navigation}
            />
            <Box sx={styles.innerBox}>
                <RecordsTable
                    records={records}
                    setRecords={setRecords}
                    pageSize={pageSize}
                    currentPage={currentPage}
                    sortBy={sortBy}
                    sortAscending={sortAscending}
                    recordCount={recordCount}
                    setPageSize={setPageSize}
                    setCurrentPage={setCurrentPage}
                    appliedFilters={filterBy}
                    handleApplyFilters={handleApplyFilters}
                    setSortBy={setSortBy}
                    setSortAscending={setSortAscending}
                    setOpenColumnSelect={setOpenColumnSelect}
                />
            </Box>
            {showDocumentModal && 
                <UploadDocumentsModal 
                    setShowModal={setShowDocumentModal}
                    handleUploadDocument={handleUploadDocument}
                />
            }
            { recordGroup && 
                <ColumnSelectDialog
                open={openColumnSelect}
                onClose={() => setOpenColumnSelect(false)}
                recordGroup={recordGroup}
                handleUpdateRecordGroup={handleUpdateRecordGroup}
                />
            }
            <PopupModal
                open={openDeleteModal}
                handleClose={() => setOpenDeleteModal(false)}
                text="Are you sure you want to delete this record group?"
                handleSave={handleDeleteRecordGroup}
                buttonText='Delete'
                buttonColor='error'
                buttonVariant='contained'
                width={400}
            />
            <PopupModal
                input
                open={openUpdateNameModal}
                handleClose={() => setOpenUpdateNameModal(false)}
                text={recordGroupName}
                textLabel='Document group Name'
                handleEditText={handleChangeRecordGroupName}
                handleSave={handleUpdateRecordGroupName}
                buttonText='Update'
                buttonColor='primary'
                buttonVariant='contained'
                width={400}
            />
        </Box>
    );
};

export default RecordGroupPage;