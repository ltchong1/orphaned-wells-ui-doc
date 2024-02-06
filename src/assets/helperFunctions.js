
export const formatDate = (timestamp) => {
  if (timestamp !== null) {
    let date = new Date(timestamp*1000)
    let day = date.getDate()
    let month = date.getMonth()
    let year = date.getFullYear()
    let formattedDate = `${month+1}/${day}/${year}`
    return formattedDate
  } else return timestamp
}

export const logout = () => {
  console.log("logging out")
  localStorage.clear()
  window.location.replace("/")
}

/*
  Function for making API calls. reduces redundancy of handling unauthorizations everywhere
  parameters:
  apiFunc: Function
  apiParams: Array<any>
  onSuccess: Function
  onError: Function
*/
export const callAPI = (apiFunc, apiParams, onSuccess, onError) => {
  apiFunc(...apiParams)
  .then(response => {
      response.json()
      .then((data)=> {
          if (response.status === 200) {
              onSuccess(data)
          } else if (response.status === 401) {
              logout()
          } else {
              onError(data)
          }
      }).catch((e) => {
        onError(e)
      })
  }).catch((e) =>{
    onError(e)
  })
}

export const callAPIWithBlobResponse = (apiFunc, apiParams, onSuccess, onError) => {
  apiFunc(...apiParams)
  .then(response => {
      response.blob()
      .then((data)=> {
          if (response.status === 200) {
              onSuccess(data)
          } else if (response.status === 401) {
              logout()
          } else {
              onError(data)
          }
      }).catch((e) => {
        onError(e)
      })
  }).catch((e) =>{
    onError(e)
  })  
} 