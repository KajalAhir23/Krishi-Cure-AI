async function run() {
  console.log("Calling Nominatim directly...");
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=Ahmedabad&limit=5`;
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });
    console.log("Status:", res.status);
    console.log("Headers:", Object.fromEntries(res.headers.entries()));
    const text = await res.text();
    console.log("Body:", text);
  } catch (err) {
    console.error("Fetch Error:", err);
  }
}
run();
