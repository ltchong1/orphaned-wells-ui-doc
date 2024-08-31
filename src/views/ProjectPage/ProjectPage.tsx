import React, { FC, useState, useEffect } from 'react';
import { Box } from '@mui/material';
import { useParams, useNavigate } from "react-router-dom";
import { getProjectData, uploadDocument, deleteProject, updateProject } from '../../services/app.service';
import RecordsTable from '../../components/RecordsTable/RecordsTable';
import Subheader from '../../components/Subheader/Subheader';
import UploadDocumentsModal from '../../components/UploadDocumentsModal/UploadDocumentsModal';
import PopupModal from '../../components/PopupModal/PopupModal';
import { callAPI } from '../../assets/helperFunctions';
import { convertFiltersToMongoFormat } from '../../assets/helperFunctions';
import { ProjectData } from '../../types';

const Project: FC = () => {
    const params = useParams<{ id: string }>(); 
    const navigate = useNavigate();
    const [records, setRecords] = useState<any[]>([]);
    const [projectData, setProjectData] = useState<ProjectData>({ attributes: [], id_: params.id, name: "", settings: {} });
    const [showDocumentModal, setShowDocumentModal] = useState<boolean>(false);
    const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);
    const [openUpdateNameModal, setOpenUpdateNameModal] = useState<boolean>(false);
    const [projectName, setProjectName] = useState<string>("");
    const [recordCount, setRecordCount] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>(0);
    const [pageSize, setPageSize] = useState<number>(100);
    const [sortBy, setSortBy] = useState<string>('dateCreated');
    const [sortAscending, setSortAscending] = useState<number>(1);
    const [filterBy, setFilterBy] = useState<any[]>(
            JSON.parse(localStorage.getItem("appliedFilters") || '{}')[params.id || ""] || []
    );

    useEffect(() => {
        loadData();
    }, [params.id, pageSize, currentPage, sortBy, sortAscending, filterBy]);

    useEffect(() => {
        setCurrentPage(0);
    }, [sortBy, sortAscending, filterBy]);

    const loadData = (): void => {
        const sort: [string, number] = [sortBy, sortAscending];
        const args: [string, number, number, [string, number], any] = [params.id || "", currentPage, pageSize, sort, convertFiltersToMongoFormat(filterBy)];
        callAPI(
            getProjectData,
            args,
            handleSuccess,
            (e: Error) => { console.error('error getting project data: ', e); }
        );
    };

    const handleSuccess = (data: { records: any[], project_data: ProjectData, record_count: number }): void => {
        setRecords(data.records);
        setProjectData(data.project_data);
        setProjectName(data.project_data.name);
        setRecordCount(data.record_count);
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

    const handleUploadDocument = (file: File): void => {
        const formData = new FormData();
        formData.append('file', file, file.name);
        callAPI(
            uploadDocument,
            [formData, projectData.id_],
            handleSuccessfulDocumentUpload,
            (e: Error) => { console.error('error on file upload: ', e); }
        );
    };

    const handleSuccessfulDocumentUpload = (): void => {
        setTimeout(() => {
            window.location.reload();
        }, 500);
    };

    const handleUpdateProject = (): void => {
        setOpenUpdateNameModal(true);
    };

    const handleDeleteProject = (): void => {
        setOpenDeleteModal(false);
        callAPI(
            deleteProject,
            [projectData.id_],
            (data: any) => navigate("/projects", { replace: true }),
            (e: Error) => { console.error('error on deleting project: ', e); }
        );
    };

    const handleChangeProjectName = (event: React.ChangeEvent<HTMLInputElement>): void => {
        setProjectName(event.target.value);
    };

    const handleUpdateProjectName = (): void => {
        setOpenUpdateNameModal(false);
        callAPI(
            updateProject,
            [params.id, { name: projectName }],
            (data: any) => window.location.reload(),
            (e: Error) => console.error('error on updating project name: ', e)
        );
    };

    return (
        <Box sx={styles.outerBox}>
            <Subheader
                currentPage={projectData.name}
                buttonName="Upload new record(s)"
                handleClickButton={() => setShowDocumentModal(true)}
                actions={(localStorage.getItem("role") && localStorage.getItem("role") === "10") ?
                    {
                        "Change project name": handleUpdateProject, 
                        "Delete project": () => setOpenDeleteModal(true),
                    }
                    :
                    {
                        "Change project name": handleUpdateProject, 
                    }
                }
                previousPages={{ "Projects": () => navigate("/projects", { replace: true }) }}
            />
            <Box sx={styles.innerBox}>
                <RecordsTable
                    projectData={projectData}
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
                    setAppliedFilters={setFilterBy}
                    setSortBy={setSortBy}
                    setSortAscending={setSortAscending}
                />
            </Box>
            {showDocumentModal && 
                <UploadDocumentsModal 
                    setShowModal={setShowDocumentModal}
                    handleUploadDocument={handleUploadDocument}
                />
            }
            <PopupModal
                open={openDeleteModal}
                handleClose={() => setOpenDeleteModal(false)}
                text="Are you sure you want to delete this project?"
                handleSave={handleDeleteProject}
                buttonText='Delete'
                buttonColor='error'
                buttonVariant='contained'
                width={400}
            />
            <PopupModal
                input
                open={openUpdateNameModal}
                handleClose={() => setOpenUpdateNameModal(false)}
                text={projectName}
                textLabel='Project Name'
                handleEditText={handleChangeProjectName}
                handleSave={handleUpdateProjectName}
                buttonText='Update'
                buttonColor='primary'
                buttonVariant='contained'
                width={400}
            />
        </Box>
    );
};

export default Project;