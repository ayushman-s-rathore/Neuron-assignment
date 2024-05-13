function formatTimestamp(timestamp) {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    const milliseconds = String(date.getMilliseconds()).padStart(3, '0');
    const timezoneOffset = (date.getTimezoneOffset() / 60).toString().padStart(2, '0');
  
    const formattedTimestamp = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds} +0530`;
    return formattedTimestamp;
  }
  
  
 export  function generateTimestamps(startTimestamp, endTimestamp) {
    const timestamps = [];
    let currentTimestamp = new Date(startTimestamp);
  
    while (currentTimestamp <= endTimestamp) {
      timestamps.push(formatTimestamp(currentTimestamp));
      currentTimestamp.setHours(currentTimestamp.getHours() + 2);
    }
  
    return timestamps;
  }
  
  