export const userSort = (a,b) => {
  if (a.Name.Last > b.Name.Last) return 1
  if (a.Name.Last < b.Name.Last) return -1
  return 0
}
