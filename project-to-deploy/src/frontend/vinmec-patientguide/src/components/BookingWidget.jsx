import { useState, useEffect, useMemo } from 'react';
import { colors, shadows, gradients } from '../styles/tokens';
import { getDoctorsByDepartment, getDoctorSchedule, createBooking } from '../services/agentApi';

function dateRange(count = 7) {
  return Array.from({ length: count }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return {
      day: d.toLocaleDateString('vi-VN', { weekday: 'short' }),
      date: d.getDate(),
      month: d.getMonth() + 1,
      full: d.toISOString().split('T')[0], // YYYY-MM-DD
      label: `${d.getDate()}/${d.getMonth() + 1}`,
    };
  });
}

export default function BookingWidget({ departmentId, onBooked }) {
  const [step, setStep] = useState('doctors'); // doctors | slots | success
  const [doctors, setDoctors] = useState([]);
  const [deptInfo, setDeptInfo] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [loading, setLoading] = useState(true);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [booking, setBooking] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const dates = useMemo(() => dateRange(7), []);

  // Load doctors on mount
  useEffect(() => {
    let c = false;
    (async () => {
      try {
        const data = await getDoctorsByDepartment(departmentId);
        if (!c) {
          setDoctors(data.doctors || []);
          setDeptInfo(data.department || null);
        }
      } catch {
        if (!c) setError('Không thể tải danh sách bác sĩ.');
      } finally {
        if (!c) setLoading(false);
      }
    })();
    return () => { c = true; };
  }, [departmentId]);

  // Load schedule when doctor + date selected
  useEffect(() => {
    if (!selectedDoctor || !selectedDate) return;
    let c = false;
    setSlotsLoading(true);
    setSlots([]);
    setSelectedSlot(null);
    (async () => {
      try {
        const data = await getDoctorSchedule(selectedDoctor.id, selectedDate.full);
        if (!c) setSlots(data.availableSlots || []);
      } catch {
        if (!c) setSlots([]);
      } finally {
        if (!c) setSlotsLoading(false);
      }
    })();
    return () => { c = true; };
  }, [selectedDoctor, selectedDate]);

  const handleConfirm = async () => {
    if (!selectedDoctor || !selectedDate || !selectedSlot) return;
    setBooking(true);
    setError(null);
    try {
      const data = await createBooking({
        date: selectedDate.full,
        time: selectedSlot,
        departmentId,
        doctorId: selectedDoctor.id,
      });
      setResult(data);
      setStep('success');
      if (onBooked) onBooked(data);
    } catch (err) {
      setError('Đặt lịch thất bại. Khung giờ có thể đã được đặt.');
    } finally {
      setBooking(false);
    }
  };

  const cardStyle = {
    background: colors.white,
    borderRadius: 16,
    padding: 16,
    boxShadow: shadows.sm,
    border: `2px solid ${colors.g100}`,
    width: '100%',
    marginTop: 8,
  };

  if (loading) {
    return (
      <div style={{ ...cardStyle, textAlign: 'center', padding: 24 }}>
        <span style={{ color: colors.g400 }}>⏳ Đang tải bác sĩ...</span>
      </div>
    );
  }

  if (error && doctors.length === 0) {
    return (
      <div style={{ ...cardStyle, textAlign: 'center', padding: 24 }}>
        <span style={{ color: colors.coral }}>{error}</span>
      </div>
    );
  }

  // ── Success ──
  if (step === 'success' && result) {
    return (
      <div style={{ ...cardStyle, textAlign: 'center', padding: 24, animation: 'scaleIn 0.4s ease' }}>
        <div style={{ fontSize: 40, marginBottom: 8 }}>✅</div>
        <div style={{ fontWeight: 800, fontSize: 16, color: colors.tealDark, marginBottom: 12 }}>
          Đặt lịch thành công!
        </div>
        <div style={{ textAlign: 'left', fontSize: 13, lineHeight: 2 }}>
          <div>👨‍⚕️ <strong>{selectedDoctor.name}</strong></div>
          <div>🏥 {deptInfo?.name}</div>
          <div>📅 {selectedDate.label}</div>
          <div>🕐 {selectedSlot}</div>
          <div>💰 {(result.consultationFee || 0).toLocaleString('vi-VN')}đ</div>
          <div>📌 Đã xác nhận</div>
        </div>
      </div>
    );
  }

  // ── Slots step ──
  if (step === 'slots' && selectedDoctor) {
    return (
      <div style={cardStyle}>
        {/* Doctor summary */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
          <button
            onClick={() => { setStep('doctors'); setSelectedDoctor(null); setSelectedDate(null); setSelectedSlot(null); }}
            style={{ background: 'none', border: 'none', fontSize: 18, cursor: 'pointer', color: colors.g400, padding: 0 }}
          >←</button>
          <span style={{ fontSize: 24 }}>{selectedDoctor.avatar}</span>
          <div>
            <div style={{ fontWeight: 700, fontSize: 14, color: colors.g800 }}>{selectedDoctor.name}</div>
            <div style={{ fontSize: 12, color: colors.g400 }}>{selectedDoctor.title} • ⭐ {selectedDoctor.rating}</div>
          </div>
        </div>

        {/* Date strip */}
        <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 8, marginBottom: 10 }}>
          {dates.map((d) => {
            const sel = selectedDate?.full === d.full;
            return (
              <button
                key={d.full}
                onClick={() => setSelectedDate(d)}
                style={{
                  minWidth: 52, padding: '6px 4px',
                  borderRadius: 10, border: `2px solid ${sel ? colors.teal : colors.g200}`,
                  background: sel ? colors.tealLight : colors.white,
                  cursor: 'pointer', textAlign: 'center',
                  transition: 'all 0.15s ease', flexShrink: 0,
                }}
              >
                <div style={{ fontSize: 10, color: colors.g400 }}>{d.day}</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: sel ? colors.tealDark : colors.g800 }}>{d.date}</div>
                <div style={{ fontSize: 10, color: colors.g400 }}>T{d.month}</div>
              </button>
            );
          })}
        </div>

        {/* Time slots */}
        {!selectedDate && (
          <div style={{ textAlign: 'center', padding: 12, color: colors.g400, fontSize: 13 }}>
            👆 Chọn ngày khám bên trên
          </div>
        )}
        {selectedDate && slotsLoading && (
          <div style={{ textAlign: 'center', padding: 12, color: colors.g400, fontSize: 13 }}>
            ⏳ Đang tải lịch trống...
          </div>
        )}
        {selectedDate && !slotsLoading && slots.length === 0 && (
          <div style={{ textAlign: 'center', padding: 12, color: colors.amber, fontSize: 13 }}>
            Bác sĩ không có lịch trống vào ngày này.
          </div>
        )}
        {selectedDate && !slotsLoading && slots.length > 0 && (
          <>
            <div style={{ fontSize: 12, color: colors.g400, marginBottom: 6 }}>Chọn giờ khám:</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {(Array.isArray(slots) ? slots : []).map((t) => {
                const sel = selectedSlot === t;
                return (
                  <button
                    key={t}
                    onClick={() => setSelectedSlot(t)}
                    style={{
                      padding: '8px 14px', borderRadius: 10, fontSize: 13, fontWeight: 600,
                      border: `2px solid ${sel ? colors.teal : colors.g200}`,
                      background: sel ? gradients.teal : colors.white,
                      color: sel ? colors.white : colors.g800,
                      cursor: 'pointer', transition: 'all 0.15s ease',
                    }}
                  >
                    {t}
                  </button>
                );
              })}
            </div>
          </>
        )}

        {error && (
          <div style={{ color: colors.coral, fontSize: 13, marginTop: 8, textAlign: 'center' }}>{error}</div>
        )}

        {/* Confirm button */}
        {selectedSlot && (
          <button
            onClick={handleConfirm}
            disabled={booking}
            style={{
              width: '100%', marginTop: 14, padding: '12px 0',
              borderRadius: 12, border: 'none', fontWeight: 700, fontSize: 14,
              background: booking ? colors.g300 : gradients.teal,
              color: colors.white, cursor: booking ? 'default' : 'pointer',
              boxShadow: shadows.teal, transition: 'all 0.2s ease',
            }}
          >
            {booking ? '⏳ Đang đặt...' : `✅ Xác nhận đặt lịch ${selectedSlot} ngày ${selectedDate.label}`}
          </button>
        )}
      </div>
    );
  }

  // ── Doctor list step ──
  return (
    <div style={cardStyle}>
      <div style={{ fontSize: 13, fontWeight: 700, color: colors.tealDark, marginBottom: 10 }}>
        {deptInfo?.icon} Bác sĩ {deptInfo?.name}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {doctors.map((doc) => (
          <button
            key={doc.id}
            onClick={() => { setSelectedDoctor(doc); setStep('slots'); }}
            style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: 12, borderRadius: 12,
              border: `2px solid ${colors.g100}`,
              background: colors.white, cursor: 'pointer',
              textAlign: 'left', transition: 'all 0.15s ease',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = colors.teal; e.currentTarget.style.background = colors.tealLight; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = colors.g100; e.currentTarget.style.background = colors.white; }}
          >
            <span style={{ fontSize: 28, flexShrink: 0 }}>{doc.avatar}</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 700, fontSize: 13, color: colors.g800 }}>{doc.name}</div>
              <div style={{ fontSize: 11, color: colors.g400, marginTop: 2 }}>
                {doc.title} • {doc.experience} năm KN • ⭐ {doc.rating}
              </div>
              {doc.subSpecialties?.length > 0 && (
                <div style={{ fontSize: 11, color: colors.teal, marginTop: 2 }}>
                  {doc.subSpecialties.join(', ')}
                </div>
              )}
              <div style={{ fontSize: 11, color: colors.g600, marginTop: 2 }}>
                💰 {(doc.consultationFee || 0).toLocaleString('vi-VN')}đ
              </div>
            </div>
            <span style={{ color: colors.teal, fontSize: 16, flexShrink: 0 }}>→</span>
          </button>
        ))}
      </div>
    </div>
  );
}
