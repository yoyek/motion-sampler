export function getNextId(records) {
  const maxId = records?.length ? Math.max(...records.map(r => r.id)) : 0
  return maxId + 1
}

