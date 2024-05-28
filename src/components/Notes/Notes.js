import React, {useEffect, useState} from 'react';
import { useParams } from "react-router-dom";
import PopupModal from '../PopupModal/PopupModal';
import { updateRecord } from '../../services/app.service';
import { callAPI } from '../../assets/helperFunctions';


export default function Notes(props) {
    const { notes, openNotesModal, setOpenNotesModal } = props;
    const [ recordNotes, setRecordNotes ] = useState("")
    let params = useParams(); 
    useEffect(() => {
        setRecordNotes(notes)
    },[notes, params.id])

    const handleChangeRecordNotes = (event) => {
        setRecordNotes(event.target.value)
    }

    const handleUpdateRecordNotes = () => {
        callAPI(
            updateRecord,
            [params.id, {data: {"notes": recordNotes}, type: "notes"}],
            (data) => setOpenNotesModal(false),
            handleFailedUpdate
        )
    }

    const handleFailedUpdate = (data) => {
        console.log("unable to update notes")
        console.error(data)
    }

  return ( 
    <PopupModal
        input
        open={openNotesModal}
        handleClose={() => setOpenNotesModal(false)}
        text={recordNotes}
        textLabel='Notes'
        handleEditText={handleChangeRecordNotes}
        handleSave={handleUpdateRecordNotes}
        buttonText='Save notes'
        buttonColor='primary'
        buttonVariant='contained'
        width={600}
        multiline
        inputrows={4}
    />
  );

}


