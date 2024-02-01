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