export async function fetchFromBackend(endpoint: string) {
  const res = await fetch(`http://localhost:3000${endpoint}`);
  if (!res.ok) throw new Error('API request failed');
  return res.json();
}
