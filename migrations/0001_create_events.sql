-- See "Data model" in docs/design.md.
CREATE TABLE events (
  id TEXT PRIMARY KEY,
  patient_id TEXT NOT NULL,
  datetime TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('seizure', 'wake', 'sleep', 'other')),
  recording_filename TEXT,
  transcript TEXT,
  notes TEXT NOT NULL,
  recorded_at TEXT NOT NULL
);

CREATE INDEX events_patient_datetime ON events (patient_id, datetime);
