export async function DistillChoice(payload, type) {
  const HOST = import.meta.env.VITE_API_URL || "http://localhost:5002";
  
  const body = type === 'image' 
    ? { visualPayload: payload } 
    : { literalInput: payload };

  const res = await fetch(`${HOST}/api/v1/resolve`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });

  if (!res.ok) throw new Error("The decision layer could not be reached.");
  const json = await res.json();
  if (json.status === 'error') throw new Error(json.message);
  return json.data;
}
