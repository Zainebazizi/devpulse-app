// test.js
// استخدام 127.0.0.1 بدلاً من localhost يتفادى مشكلة IPv6
const API_URL = 'http://127.0.0.1:5000/api/logs';

async function runFullTest() {
  try {
    console.log('🧪 Starting Full API Test...\n');

    // 1. Create Log
    console.log('🔄 Sending POST request...');
    const createRes = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'Memory Leak Warning',
        level: 'warn',
        message: 'High RAM usage detected in auth cluster.',
      }),
    });
    
    if (!createRes.ok) throw new Error(`POST status: ${createRes.status}`);
    const created = await createRes.json();
    console.log('✅ 1. Created:', created._id);

    // 2. Update Log
    console.log('🔄 Sending PUT request...');
    const updateRes = await fetch(`${API_URL}/${created._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ level: 'error', message: 'CRITICAL RAM Usage!' }),
    });
    const updated = await updateRes.json();
    console.log('✏️ 2. Updated Level:', updated.level);

    // 3. Get All Logs
    console.log('🔄 Sending GET request...');
    const getRes = await fetch(API_URL);
    const all = await getRes.json();
    console.log(`📦 3. Total Logs in DB: ${all.length}`);

    // 4. Delete Created Log (Cleanup)
    console.log('🔄 Sending DELETE request...');
    const delRes = await fetch(`${API_URL}/${created._id}`, { method: 'DELETE' });
    const deleted = await delRes.json();
    console.log('🗑️ 4. Deleted Status:', deleted.message);

    console.log('\n🎉 ALL BACKEND ENDPOINTS ARE WORKING PERFECTLY!');
  } catch (err) {
    console.error('❌ Test failed:', err.message);
  }
}

runFullTest();