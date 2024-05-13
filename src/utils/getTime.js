export const getTime = (add) =>{
  const currentDate = new Date();
const year = currentDate.getFullYear()+ add;
const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Months are zero-based
const day = String(currentDate.getDate()).padStart(2, '0');
const hours = String(currentDate.getHours()).padStart(2, '0');
const minutes = String(currentDate.getMinutes()).padStart(2, '0');
const seconds = String(currentDate.getSeconds()).padStart(2, '0');
const milliseconds = String(currentDate.getMilliseconds()).padStart(3, '0');
const timeZoneOffset = currentDate.getTimezoneOffset(); // Timezone offset in minutes

// Construct the timestamp string
const currentTimestamp = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds} ${getTimezoneOffsetString(timeZoneOffset)}`;


// Function to format timezone offset
function getTimezoneOffsetString(offsetInMinutes) {
  const sign = offsetInMinutes > 0 ? '-' : '+';
  const hours = String(Math.abs(Math.floor(offsetInMinutes / 60))).padStart(2, '0');
  const minutes = String(Math.abs(offsetInMinutes % 60)).padStart(2, '0');
  return `${sign}${hours}${minutes}`;
}
return currentTimestamp
}