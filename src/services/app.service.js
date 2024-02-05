let BACKEND_URL = "http://localhost:8001"
// this is subject to change every time we stop and start the server
// let BACKEND_URL = "http://34.121.174.243:8001"

let expired_id_token = "eyJhbGciOiJSUzI1NiIsImtpZCI6Ijg1ZTU1MTA3NDY2YjdlMjk4MzYxOTljNThjNzU4MWY1YjkyM2JlNDQiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiIxMDk1MTQ2NTIzMDMxLWE5bW9iZXMxaXFhZDV2bzh1bm9jOW82bXV1azNzaHJ1LmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwiYXVkIjoiMTA5NTE0NjUyMzAzMS1hOW1vYmVzMWlxYWQ1dm84dW5vYzlvNm11dWszc2hydS5hcHBzLmdvb2dsZXVzZXJjb250ZW50LmNvbSIsInN1YiI6IjEwOTcwMzMyNzQwODIxODY1MjcxMiIsImhkIjoibGJsLmdvdiIsImVtYWlsIjoibXBlc2NlQGxibC5nb3YiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiYXRfaGFzaCI6IlZUM0J2ck15ZUI4eFZDZXJsbGxfVEEiLCJuYW1lIjoiTWljaGFlbCBQZXNjZSIsInBpY3R1cmUiOiJodHRwczovL2xoMy5nb29nbGV1c2VyY29udGVudC5jb20vYS9BQ2c4b2NKOGtxT25Cb1g4WWd1MEdqVHJTaVFWNW1oTnBQMkREbm9LQnItU2psVHY9czk2LWMiLCJnaXZlbl9uYW1lIjoiTWljaGFlbCIsImZhbWlseV9uYW1lIjoiUGVzY2UiLCJsb2NhbGUiOiJlbiIsImlhdCI6MTcwNjg4MDkxNiwiZXhwIjoxNzA2ODg0NTE2fQ.wbYpRmFPJTPXFu3FJtXsV9qphPKAIxIizxL9ymQkPk9DzRltjT_MNvpcg3tFjszXh8CcQdVoA-l0fX-NwOxPkTmTFASGKx6EiVjYGB2Gr-ikmRhq9qbcHSlvgcRJw-Ln-vM5iD9BvISf4XFYf2OqObCSmM3whMJ9g6r9s2h9A2QigGZ1SENpq00SM94KElQ8K-92azoH1aMK2GJsl7iiaUO89sUmXkKHHoOWLF9rr9Ax1wZMdGRSO8Zyf3Vxh_lmz5IrDax2ZpWBkZWBecaDomLmR0kOpFmbv9u0j_IBqoaDOpy_f0e3Wwb3V1kCJbPewbWfq8rvjdX9TNO9U7qpjw"
export const getProjects = () => {
    return fetch(BACKEND_URL+'/get_projects', {
        mode: 'cors',
        headers: {"Authorization": "Bearer "+ localStorage.getItem("id_token")}
    });
}; 

export const getProjectData = (project_id) => {
    return fetch(BACKEND_URL+'/get_project/'+project_id, {
        mode: 'cors',
        headers: {"Authorization": "Bearer "+ localStorage.getItem("id_token")}
    });
}; 

export const addProject = (data) => {
    return fetch(BACKEND_URL+'/add_project', {
        method: 'POST', 
        mode: 'cors',
        body: JSON.stringify(data),
        headers: {"Authorization": "Bearer "+ localStorage.getItem("id_token")}
    });
}; 

export const uploadDocument = (data, project_id) => {
    return fetch(BACKEND_URL+'/upload_document/'+project_id, {
        method: 'POST', 
        mode: 'cors',
        body: data,
        headers: {"Authorization": "Bearer "+ localStorage.getItem("id_token")}
    });
}

export const getRecordData = (record_id) => {
    return fetch(BACKEND_URL+'/get_record/'+record_id, {
        mode: 'cors',
        headers: {"Authorization": "Bearer "+ localStorage.getItem("id_token")}
    });
}

export const downloadRecordsCSV = (project_id) => {
    return fetch(BACKEND_URL+'/download_records/'+project_id, {
        mode: 'cors',
        headers: {"Authorization": "Bearer "+ localStorage.getItem("id_token")}
    });
}

export const updateProject = (project_id, data) => {
    return fetch(BACKEND_URL+'/update_project/'+project_id, {
        method: 'POST', 
        mode: 'cors',
        body: JSON.stringify(data),
        headers: {"Authorization": "Bearer "+ localStorage.getItem("id_token")}
    });
}

export const updateRecord = (record_id, data) => {
    return fetch(BACKEND_URL+'/update_record/'+record_id, {
        method: 'POST', 
        mode: 'cors',
        body: JSON.stringify(data),
        headers: {"Authorization": "Bearer "+ localStorage.getItem("id_token")}
    });
}

export const deleteProject = (project_id) => {
    return fetch(BACKEND_URL+'/delete_project/'+project_id, {
        method: 'POST', 
        mode: 'cors',
        headers: {"Authorization": "Bearer "+ localStorage.getItem("id_token")}
    });
}

export const deleteRecord = (record_id) => {
    return fetch(BACKEND_URL+'/delete_record/'+record_id, {
        method: 'POST', 
        mode: 'cors',
        headers: {"Authorization": "Bearer "+ localStorage.getItem("id_token")}
    });
}

export const authLogin = (code) => {
    return fetch(BACKEND_URL+'/auth_login', {
        method: 'POST', 
        mode: 'cors',
        body: JSON.stringify(code),
        headers: {"Authorization": "Bearer "+ localStorage.getItem("id_token")}
    });
}
