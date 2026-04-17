import { useState } from 'react';
import { Shell } from '../components';
import { colors, gradients, shadows, transition } from '../styles/tokens';
import { DOCTORS, TIME_SLOTS } from '../data/constants';
import { useDateRange } from '../hooks/useDateRange';

export default function DoctorScreen({ specialty, onSelectDoctor, goBack }) {
  const [dateIdx, setDateIdx] = useState(0);
  const dates = useDateRange(7);

  return (
    <Shell title="Chọn bác sĩ" subtitle={specialty?.name} onBack={goBack}>
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 0' }}>

        {/* ── Date strip ── */}
        <div style={{
          background: colors.white,
          borderRadius: 18,
          padding: '16px 18px',
          marginBottom: 20,
          boxShadow: shadows.sm,
        }}>
          <div style={{
            fontSize: 13,
            fontWeight: 700,
            color: colors.g600,
            marginBottom: 12,
          }}>
            Chọn ngày khám
          </div>
          <div style={{ display: 'flex', gap: 8, overflowX: 'auto' }}>
            {dates.map((d, i) => (
              <button
                key={i}
                onClick={() => setDateIdx(i)}
                style={{
                  minWidth: 54,
                  padding: '10px 8px',
                  borderRadius: 14,
                  border: 'none',
                  background: dateIdx === i ? gradients.teal : colors.g100,
                  color: dateIdx === i ? colors.white : colors.g800,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 2,
                  boxShadow: dateIdx === i ? '0 4px 12px rgba(0,137,123,0.25)' : 'none',
                  transition,
                }}
              >
                <span style={{ fontSize: 10, fontWeight: 600, opacity: 0.7 }}>{d.day}</span>
                <span style={{ fontSize: 18, fontWeight: 800 }}>{d.date}</span>
                <span style={{ fontSize: 9, opacity: 0.6 }}>Th{d.month}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ── Doctor cards ── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 300px), 1fr))',
          gap: 14,
        }}>
          {DOCTORS.map((doc) => (
            <div
              key={doc.id}
              onClick={() => onSelectDoctor(doc)}
              style={{
                background: colors.white,
                borderRadius: 18,
                padding: 20,
                cursor: 'pointer',
                border: '2px solid transparent',
                transition,
                boxShadow: shadows.sm,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = colors.teal;
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,137,123,0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'transparent';
                e.currentTarget.style.boxShadow = shadows.sm;
              }}
            >
              <div style={{
                display: 'flex',
                gap: 14,
                alignItems: 'center',
                marginBottom: 14,
              }}>
                <div style={{
                  width: 52,
                  height: 52,
                  borderRadius: 16,
                  background: gradients.tealSoft,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 28,
                }}>
                  {doc.avatar}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 15, fontWeight: 700 }}>{doc.name}</div>
                  <div style={{ fontSize: 12, color: colors.g400, marginTop: 2 }}>
                    {specialty?.name} · {doc.exp}
                  </div>
                </div>
                <div style={{
                  background: colors.tealLight,
                  borderRadius: 8,
                  padding: '4px 10px',
                  fontSize: 12,
                  fontWeight: 700,
                  color: colors.tealDark,
                }}>
                  ⭐ {doc.rating}
                </div>
              </div>

              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {TIME_SLOTS.slice(0, 4).map((s) => (
                  <span
                    key={s.id}
                    style={{
                      fontSize: 11,
                      padding: '4px 10px',
                      borderRadius: 8,
                      background: colors.g100,
                      color: colors.g600,
                      fontWeight: 600,
                    }}
                  >
                    {s.time}
                  </span>
                ))}
                <span style={{
                  fontSize: 11,
                  padding: '4px 10px',
                  color: colors.teal,
                  fontWeight: 600,
                }}>
                  +{TIME_SLOTS.length - 4} khác
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Shell>
  );
}
