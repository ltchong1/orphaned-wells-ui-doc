let BACKEND_URL = "http://localhost:8001"
// this is subject to change every time we stop and start the server
// let BACKEND_URL = "http://34.121.174.243:8001"

export const getProjects = () => {
    return fetch(BACKEND_URL+'/get_projects', {
        mode: 'cors',
    });
}; 

export const getProjectData = (project_id) => {
    return fetch(BACKEND_URL+'/get_project/'+project_id, {
        mode: 'cors',
    });
}; 

export const addProject = (data) => {
    return fetch(BACKEND_URL+'/add_project', {
        method: 'POST', 
        mode: 'cors',
        body: JSON.stringify(data)
    });
}; 

export const uploadDocument = (data, project_id) => {
    return fetch(BACKEND_URL+'/upload_document/'+project_id, {
        method: 'POST', 
        mode: 'cors',
        body: data
    });
}

export const getRecordData = (record_id) => {
    return fetch(BACKEND_URL+'/get_record/'+record_id, {
        mode: 'cors',
    });
}