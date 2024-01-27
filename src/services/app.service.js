export const getProjects = () => {
    return fetch('http://localhost:8001/get_projects', {
        mode: 'cors',
    });
}; 

export const getProjectData = (project_id) => {
    return fetch('http://localhost:8001/get_project/'+project_id, {
        mode: 'cors',
    });
}; 

export const addProject = (data) => {
    return fetch('http://localhost:8001/add_project', {
        method: 'POST', 
        mode: 'cors',
        body: JSON.stringify(data)
    });
}; 

export const uploadDocument = (data, project_id) => {
    return fetch('http://localhost:8001/upload_document/'+project_id, {
        method: 'POST', 
        mode: 'cors',
        body: data
    });
}