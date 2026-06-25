async function run() {
  console.log("Querying port 3001...");
  try {
    const urls = [
      'http://localhost:3001/api/geocode?q=Ahmedabad',
      'http://localhost:3001/api/geocode?lat=23.0225&lon=72.5714',
      'http://localhost:3001/api/weather?city=Ahmedabad'
    ];
    for (const url of urls) {
      console.log(`\nFetching ${url}...`);
      const res = await fetch(url);
      console.log("Status:", res.status);
      const text = await res.text();
      console.log("Response:", text);
    }
  } catch (err) {
    console.error("Fetch Error:", err);
  }
}
run();
