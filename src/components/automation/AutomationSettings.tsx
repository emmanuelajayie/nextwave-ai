import React, { useState } from 'react';

interface AutomationSettingsProps {
  onSave: (settings: {
    frequency: string;
    notifyByEmail: boolean;
    autoClean: boolean;
  }) => void;
}

const AutomationSettings: React.FC<AutomationSettingsProps> = ({ onSave }) => {
  const [frequency, setFrequency] = useState('daily');
  const [notifyByEmail, setNotifyByEmail] = useState(false);
  const [autoClean, setAutoClean] = useState(true);

  const handleSave = () => {
    const settings = {
      frequency,
      notifyByEmail,
      autoClean,
    };
    onSave(settings);
  };

  return (
    <div>
      <h2>Automation Settings</h2>

      <label>
        Frequency:
        <select value={frequency} onChange={(e) => setFrequency(e.target.value)}>
          <option value="hourly">Hourly</option>
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
        </select>
      </label>

      <br />

      <label>
        Notify By Email:
        <input
          type="checkbox"
          checked={notifyByEmail}
          onChange={() => setNotifyByEmail(!notifyByEmail)}
        />
      </label>

      <br />

      <label>
        Auto Clean Data:
        <input
          type="checkbox"
          checked={autoClean}
          onChange={() => setAutoClean(!autoClean)}
        />
      </label>

      <br />

      <button onClick={handleSave}>Save Automation Settings</button>
    </div>
  );
};

export default AutomationSettings;
