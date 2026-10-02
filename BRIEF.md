Hello!

I am working on a hackathon project. (To be precise, a project continuing from a hackathon I participated in earlier this week.)

The hackathon was with the NHS (yes, we are in the UK, today).

The idea for the app is 'Seizure Diary'.

It is reasonably simple, and small in scope:

- A patient gets given an EEG headset to take home and wear.
- The headset records the patient's brain activity continuously.
- But, we want the patient to be able to self-report 'events':
  - Possible seizures
  - When they wake up
  - When they go to sleep
  - Other misc 'events'

The problem this application hopes to solve is that patients currently have to record these 'events' using a paper form, which they misplace, etc.

By making the act of 'recording events' a digital process, we aim to make it far easier for the patient, and therefore improve the quality of the data recorded.

The user flow is approx:

- User opens the app
- User clicks "record an event"
- User speaks into their phone
- User clicks "stop recording"
- User waits for the app to process the recording
- User reviews the information about this event is correct
- User confirms and saves the event

By using speech-to-text, we aim to make the act of entering useful data very easy for the user. Note: the user may be in the process of having a seizure while using the app, which means the application _must_ be incredibly simple to use.

For this spike, our tech stack should be:

- React
- Tailwind CSS
- Cloudflare Workers
- D1 (Cloudflare's serverless SQL database)
- TypeScript
- Vite
- Shadcn UI
- Phosphor Icons

What I would like us to do next is:

- Create a 'level 0' system diagram, that describes the entire system in a 'zoomed-out' fashion. Please create this in `/docs/system-diagram-level-0.md`, using Mermaid.
