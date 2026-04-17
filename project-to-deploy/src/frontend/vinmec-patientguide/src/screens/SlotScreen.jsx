import { useState } from 'react';
import { Shell, Btn } from '../components';
import { colors, gradients, shadows, transition } from '../styles/tokens';
import { TIME_SLOTS } from '../data/constants';

export default function SlotScreen({ doctor, specialty, onConfirm, goBack }) {
  const [sel, setSel] = useState(null);
  const morning = TIME_SLOTS.filter((s) => s.period === 'Sáng');
  const afternoon = TIME_SLOTS.filter((s) => s.period === 'Chiều');

  return (
    <Shell
      title="Chọn giờ khám"
      subtitle={doctor?.name}
      onBack={goBack}
      footer={
        <Btn
          onClick={() => sel && onConfirm(sel)}
          disabled={!sel}
          style={{ width: '100%', padding: 16, borderRadius: 16 }}
        >
          {sel ? `Xác nhận lúc ${sel.time}` : 'Chọn giờ khám'}
        </Btn>
      }
    >
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 0' }}>

        {/* ── Doctor summary card ── */}
        <div style={{
          background: colors.white,
          borderRadius: 18,
          padding: 20,
          marginBottom: 24,
          display: 'flex',
          gap: 16,
          alignItems: 'center',
          boxShadow: shadows.sm,
        }}>
          <div style={{
            width: 60,
            height: 60,
            borderRadius: 18,
            background: gradients.tealSoft,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 32,
          }}>
            {doctor?.avatar}
          </div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700 }}>{doctor?.name}</div>
            <div style={{ fontSize: 13, color: colors.g400, marginTop: 2 }}>
              {specialty?.name} · {doctor?.exp}
            </div>
            <div style={{ fontSize: 13, color: colors.teal, fontWeight: 600, marginTop: 3 }}>
              ⭐ {doctor?.rating}
            </div>
          </div>
        </div>

        {/* ── Time slot groups ── */}
        {[
          { label: 'Buổi sáng ☀️', slots: morning },
          { label: 'Buổi chiều 🌤️', slots: afternoon },
        ].map((group) => (
          <div key={group.label} style={{ marginBottom: 24 }}>
            <div style={{
              fontSize: 14,
              fontWeight: 700,
              color: colors.g600,
              marginBottom: 12,
            }}>
              {group.label}
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(90px, 1fr))',
              gap: 10,
            }}>
              {group.slots.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSel(s)}
                  style={{
                    padding: '14px 8px',
                    borderRadius: 14,
                    border: `2px solid ${sel?.id === s.id ? colors.teal : colors.g200}`,
                    background: sel?.id === s.id ? colors.tealLight : colors.white,
                    color: sel?.id === s.id ? colors.tealDark : colors.g800,
                    fontSize: 15,
                    fontWeight: 700,
                    transition,
                    boxShadow: sel?.id === s.id ? shadows.tealSm : 'none',
                  }}
                >
                  {s.time}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Shell>
  );
}
