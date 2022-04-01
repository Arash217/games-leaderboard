export default async function request(url, init) {
  const res = await fetch(url, {
    headers: {
      'content-type': 'application/json',
      ...init?.headers
    },
    ...init
  })
  const data = await res.json()

  if (!res.ok) {
    throw new Error(data.message)
  }

  return data
}