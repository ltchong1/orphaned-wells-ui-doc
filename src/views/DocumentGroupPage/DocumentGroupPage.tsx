import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import { useParams, useNavigate } from "react-router-dom";
import { getDocumentGroup, uploadDocument, deleteDocumentGroup, updateDocumentGroup } from '../../services/app.service';
import RecordsTable from '../../components/RecordsTable/RecordsTable';
import Subheader from '../../components/Subheader/Subheader';
import UploadDocumentsModal from '../../components/UploadDocumentsModal/UploadDocumentsModal';
import PopupModal from '../../components/PopupModal/PopupModal';
import { callAPI } from '../../assets/helperFunctions';
import { convertFiltersToMongoFormat } from '../../assets/helperFunctions';
import { DocumentGroup } from '../../types';

const DocumentGroupPage = () => {
    const params = useParams<{ id: string }>(); 
    const navigate = useNavigate();
    const [records, setRecords] = useState<any[]>([]);
    const [documentGroup, setDocumentGroup] = useState<DocumentGroup>({ } as DocumentGroup);
    const [showDocumentModal, setShowDocumentModal] = useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [openUpdateNameModal, setOpenUpdateNameModal] = useState(false);
    const [documentGroupName, setDocumentGroupName] = useState("");
    const [recordCount, setRecordCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize, setPageSize] = useState(100);
    const [sortBy, setSortBy] = useState('dateCreated');
    const [sortAscending, setSortAscending] = useState(1);
    const [filterBy, setFilterBy] = useState<any[]>(
            JSON.parse(localStorage.getItem("appliedFilters") || '{}')[params.id || ""] || []
    );

    useEffect(() => {
        loadData();
    }, [params.id, pageSize, currentPage, sortBy, sortAscending, filterBy]);

    useEffect(() => {
        setCurrentPage(0);
    }, [sortBy, sortAscending, filterBy]);


    const loadData = () => {
        const sort: [string, number] = [sortBy, sortAscending];
        const args: [string, number, number, [string, number], any] = [params.id || "", currentPage, pageSize, sort, convertFiltersToMongoFormat(filterBy)];
        callAPI(
            getDocumentGroup,
            args,
            handleSuccess,
            (e: Error) => { console.error('error getting document group data: ', e); }
        );
    };

    const handleSuccess = (data: { records: any[], dg_data: DocumentGroup, record_count: number }) => {
        console.log(data)
        setRecords(data.records);
        setDocumentGroup(data.dg_data);
        setDocumentGroupName(data.dg_data.name);
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

    const handleUploadDocument = (file: File) => {
        const formData = new FormData();
        formData.append('file', file, file.name);
        callAPI(
            uploadDocument,
            [formData, documentGroup._id],
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

    const handleDeleteDocumentGroup = () => {
        setOpenDeleteModal(false);
        callAPI(
            deleteDocumentGroup,
            [documentGroup._id],
            (data: any) => navigate("/document_groups", { replace: true }),
            (e: Error) => { console.error('error on deleting document group: ', e); }
        );
    };

    const handleChangeDocumentGroupName = (event: React.ChangeEvent<HTMLInputElement>) => {
        setDocumentGroupName(event.target.value);
    };

    const handleUpdateDocumentGroupName = () => {
        setOpenUpdateNameModal(false);
        callAPI(
            updateDocumentGroup,
            [params.id, { name: documentGroupName }],
            (data: any) => window.location.reload(),
            (e: Error) => console.error('error on updating document group name: ', e)
        );
    };

    const handleUpdateDocumentGroup = (update: any) => {
        callAPI(
            updateDocumentGroup,
            [params.id, update],
            (data: DocumentGroup) => setDocumentGroup(data),
            (e: Error) => console.error('error on updating document group name: ', e)
        );
    };

    return (
        <Box sx={styles.outerBox}>
            <Subheader
                currentPage={documentGroup.name}
                buttonName="Upload new record(s)"
                handleClickButton={() => setShowDocumentModal(true)}
                actions={(localStorage.getItem("role") && localStorage.getItem("role") === "10") ?
                    {
                        "Change document group name": handleClickChangeName, 
                        "Delete document group": () => setOpenDeleteModal(true),
                    }
                    :
                    {
                        "Change document group name": handleClickChangeName, 
                    }
                }
                previousPages={
                    { 
                        "Projects": () => navigate("/projects", { replace: true }),
                        "Document Groups": () => navigate("/document_groups", { replace: true }),
                    }
                }
            />
            <Box sx={styles.innerBox}>
                <RecordsTable
                    documentGroup={documentGroup}
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
                    handleUpdateDocumentGroup={handleUpdateDocumentGroup}
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
                text="Are you sure you want to delete this document group?"
                handleSave={handleDeleteDocumentGroup}
                buttonText='Delete'
                buttonColor='error'
                buttonVariant='contained'
                width={400}
            />
            <PopupModal
                input
                open={openUpdateNameModal}
                handleClose={() => setOpenUpdateNameModal(false)}
                text={documentGroupName}
                textLabel='Document group Name'
                handleEditText={handleChangeDocumentGroupName}
                handleSave={handleUpdateDocumentGroupName}
                buttonText='Update'
                buttonColor='primary'
                buttonVariant='contained'
                width={400}
            />
        </Box>
    );
};

export default DocumentGroupPage;