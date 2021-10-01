export const zeroPad = (num, len = 2) => {
  let str = num.toString();
  while (str.length < len) {
    str = "0" + str;
  }
  return str;
};

export const formatTime = (date = null) => {
  if (!date) date = new Date();
  let hours = zeroPad(date.getHours());
  let minutes = zeroPad(date.getMinutes());
  let seconds = zeroPad(date.getSeconds());
  return `${hours}:${minutes}:${seconds}`;
};

export const formatDate = (date = null) => {
  if (!date) date = new Date();
  let year = date.getFullYear();
  let month = zeroPad(date.getMonth() + 1);
  let day = zeroPad(date.getDate());
  return `${year}-${month}-${day}`;
};
