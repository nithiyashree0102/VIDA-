const API = "http://localhost:3001/api";

export async function fetchStats() {
  const res = await fetch(`${API}/stats`);
  return res.json();
}

export async function fetchGraph() {
  const res = await fetch(`${API}/graph`);
  return res.json();
}

export async function fetchInsights() {
  const res = await fetch(`${API}/insights`);
  return res.json();
}

export async function saveMemory(text: string) {
  const res = await fetch(`${API}/memories`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text }),
  });

  return res.json();
}