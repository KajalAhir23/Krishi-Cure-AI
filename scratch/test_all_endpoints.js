import fetch from 'node-fetch'; // since we are using standard Node 18+ or global fetch, we can just use the global fetch.

const BASE_URL = 'http://localhost:3000';

async function testEndpoint(name, path, method = 'GET', body = null) {
  console.log(`\n----------------------------------------`);
  console.log(`[TEST] ${name} (${method} ${path})`);
  try {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
      }
    };
    if (body) {
      options.body = JSON.stringify(body);
    }
    const res = await fetch(`${BASE_URL}${path}`, options);
    console.log(`Status: ${res.status} ${res.statusText}`);
    const json = await res.json();
    if (res.ok && json.success !== false) {
      console.log(`✅ Success! Response preview:`);
      // Print first 5 lines of formatted json or a small summary to avoid flooding
      const lines = JSON.stringify(json, null, 2).split('\n');
      console.log(lines.slice(0, 15).join('\n') + (lines.length > 15 ? '\n  ...' : ''));
    } else {
      console.error(`❌ Failed! Response:`, json);
    }
  } catch (err) {
    console.error(`❌ Error during fetch:`, err.message);
  }
}

async function runTests() {
  console.log('🚀 Starting end-to-end endpoint verification tests...');

  // 1. Test /api/data
  await testEndpoint('Master Data', '/api/data');

  // 2. Test /api/firebase-config
  await testEndpoint('Firebase Config', '/api/firebase-config');

  // 3. Test /api/diagnose
  await testEndpoint('Symptom Diagnosis', '/api/diagnose', 'POST', {
    cropId: 'cotton',
    symptoms: ['sym_36', 'sym_37'],
    lang: 'en'
  });

  // 4. Test /api/fertilizer/calculate
  await testEndpoint('Fertilizer Calculation', '/api/fertilizer/calculate', 'POST', {
    cropId: 'cotton',
    fertilizerId: 'urea',
    areaUnit: 'Acre',
    areaValue: 5,
    lang: 'en'
  });

  // 5. Test /api/geocode (reverse)
  await testEndpoint('Reverse Geocoding', '/api/geocode?lat=23.0225&lon=72.5714');

  // 6. Test /api/geocode (forward search)
  await testEndpoint('Forward Geocoding', '/api/geocode?q=Ahmedabad');

  // 7. Test /api/weather (coordinates)
  await testEndpoint('Weather by Coords', '/api/weather?lat=23.0225&lon=72.5714');

  // 8. Test /api/weather (city query)
  await testEndpoint('Weather by City', '/api/weather?city=Ahmedabad');
  
  console.log(`\n----------------------------------------`);
  console.log('🎉 Verification checks completed.');
}

runTests();
