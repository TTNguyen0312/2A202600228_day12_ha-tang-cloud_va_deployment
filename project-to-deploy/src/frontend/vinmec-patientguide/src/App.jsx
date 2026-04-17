import { useState } from 'react';
import {
  HomeScreen,
  TriageScreen,
  EmergencyScreen,
  SpecialtyScreen,
  DoctorScreen,
  SlotScreen,
  SuccessScreen,
  EscalateScreen,
} from './screens';

/**
 * App-level screen router.
 *
 * Manages navigation state and the data that flows between screens:
 *   home → triage → [emergency | specialty → doctors → slots → success | escalate]
 */
export default function App() {
  const [screen, setScreen] = useState('home');
  const [specialty, setSpecialty] = useState(null);
  const [doctor, setDoctor] = useState(null);
  const [slot, setSlot] = useState(null);

  const goHome = () => {
    setScreen('home');
    setSpecialty(null);
    setDoctor(null);
    setSlot(null);
  };

  switch (screen) {
    case 'home':
      return <HomeScreen onStart={() => setScreen('triage')} />;

    case 'triage':
      return (
        <TriageScreen
          goHome={goHome}
          onEmergency={() => setScreen('emergency')}
          onSuggest={() => setScreen('specialty')}
          onEscalate={() => setScreen('escalate')}
        />
      );

    case 'emergency':
      return <EmergencyScreen goHome={goHome} />;

    case 'specialty':
      return (
        <SpecialtyScreen
          goBack={() => setScreen('triage')}
          onSelect={(s) => {
            setSpecialty(s);
            setScreen('doctors');
          }}
          onEscalate={() => setScreen('escalate')}
        />
      );

    case 'doctors':
      return (
        <DoctorScreen
          specialty={specialty}
          goBack={() => setScreen('specialty')}
          onSelectDoctor={(d) => {
            setDoctor(d);
            setScreen('slots');
          }}
        />
      );

    case 'slots':
      return (
        <SlotScreen
          doctor={doctor}
          specialty={specialty}
          goBack={() => setScreen('doctors')}
          onConfirm={(s) => {
            setSlot(s);
            setScreen('success');
          }}
        />
      );

    case 'success':
      return (
        <SuccessScreen
          doctor={doctor}
          specialty={specialty}
          slot={slot}
          goHome={goHome}
        />
      );

    case 'escalate':
      return <EscalateScreen goHome={goHome} />;

    default:
      return <HomeScreen onStart={() => setScreen('triage')} />;
  }
}
