const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_KEY = import.meta.env.VITE_API_KEY;

const authHeaders = {
  "Content-Type": "application/json",
  "X-API-Key": API_KEY,
};

export async function sendMessageToAgent(payload) {
  const response = await fetch(`${API_BASE_URL}/api/agent/chat`, {
    method: "POST",
    headers: authHeaders,
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API error ${response.status}: ${errorText}`);
  }

  return response.json();
}

export async function getDoctorsByDepartment(deptId) {
  const response = await fetch(`${API_BASE_URL}/api/departments/${deptId}/doctors`, {
    headers: authHeaders,
  });
  if (!response.ok) throw new Error(`API error ${response.status}`);
  return response.json();
}

export async function getDoctorSchedule(doctorId, date) {
  const response = await fetch(
    `${API_BASE_URL}/api/doctors/${doctorId}/schedule?date=${date}`,
    { headers: authHeaders }
  );
  if (!response.ok) throw new Error(`API error ${response.status}`);
  return response.json();
}

export async function createBooking({ date, time, departmentId, doctorId }) {
  const response = await fetch(`${API_BASE_URL}/api/booking`, {
    method: "POST",
    headers: authHeaders,
    body: JSON.stringify({
      date,
      time,
      department_id: departmentId,
      doctor_id: doctorId,
    }),
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API error ${response.status}: ${errorText}`);
  }
  return response.json();
}