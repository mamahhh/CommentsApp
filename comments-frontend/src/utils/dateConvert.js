export const formatDateTime = (isoString) => {
  const date = new Date(isoString);

  return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${String(date.getMinutes()).padStart(2, "0")}`;
}