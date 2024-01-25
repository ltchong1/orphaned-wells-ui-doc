export const getProjects = () => {
    return fetch('http://localhost:8001/get_projects', {
        mode: 'cors',
    });
}; 