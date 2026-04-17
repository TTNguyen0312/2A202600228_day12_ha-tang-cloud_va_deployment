/* ─── Mock Database ─── */

// Core triage data (used by the AI chat flow)
export { EMERGENCY_KEYWORDS, AI_QUESTIONS, SPECIALTIES, DOCTORS, TIME_SLOTS } from './constants';

// Full hospital database
export { default as departments }    from './departments';
export { default as doctors }        from './doctors';
export { default as branches }       from './branches';
export { default as patients }       from './patients';
export { default as appointments }   from './appointments';
export { default as symptomMappings } from './symptomMappings';
export { default as reviews }        from './reviews';
export { default as insurancePlans } from './insurance';

/* ─── Helper lookups ─── */

import _doctors      from './doctors';
import _departments  from './departments';
import _branches     from './branches';
import _patients     from './patients';
import _appointments from './appointments';
import _symptomMappings from './symptomMappings';

/** Find a doctor by ID */
export const findDoctor = (id) => _doctors.find((d) => d.id === id);

/** Find all doctors in a department */
export const doctorsByDepartment = (deptId) =>
  _doctors.filter((d) => d.departmentId === deptId && d.isAvailable);

/** Find a department by ID */
export const findDepartment = (id) => _departments.find((d) => d.id === id);

/** Find a branch by ID */
export const findBranch = (id) => _branches.find((b) => b.id === id);

/** Find a patient by ID */
export const findPatient = (id) => _patients.find((p) => p.id === id);

/** Find appointments for a patient */
export const appointmentsByPatient = (patientId) =>
  _appointments.filter((a) => a.patientId === patientId);

/** Find appointments for a doctor on a given date */
export const appointmentsByDoctorDate = (doctorId, date) =>
  _appointments.filter((a) => a.doctorId === doctorId && a.date === date);

/**
 * Match symptoms to suggested departments.
 * Returns sorted array by urgency: emergency > high > normal > low
 */
export const matchSymptoms = (text) => {
  const lower = text.toLowerCase();
  const matches = _symptomMappings.filter((m) =>
    m.keywords.some((kw) => lower.includes(kw))
  );

  const urgencyOrder = { emergency: 0, high: 1, normal: 2, low: 3 };
  return matches.sort((a, b) => urgencyOrder[a.urgency] - urgencyOrder[b.urgency]);
};

/**
 * Get available time slots for a doctor on a given weekday.
 * Filters out slots already booked.
 */
export const getAvailableSlots = (doctorId, date) => {
  const doctor = findDoctor(doctorId);
  if (!doctor) return [];

  const dayNames = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
  const d = new Date(date);
  const dayKey = dayNames[d.getDay()];
  const allSlots = doctor.schedule[dayKey] || [];

  const bookedTimes = appointmentsByDoctorDate(doctorId, date)
    .filter((a) => a.status !== 'cancelled')
    .map((a) => a.time);

  return allSlots.filter((time) => !bookedTimes.includes(time));
};
