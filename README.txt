ASK UPGRADE: save questions + better answers with estimates
Two parts. Part A is on Cloudflare (the Ask "brain"). Part B is two website files.

PART A: CLOUDFLARE WORKER (about 10 minutes, do this first)
Before you start: open your current worker code and copy it into a text file as a backup.

1. Create the question store
   Cloudflare dashboard > Storage & Databases > KV > Create namespace > name it ASK_LOG > Create.
2. Connect it to the worker
   Workers & Pages > healthcare-pulse-ask > Settings > Bindings > Add > KV namespace.
   Variable name: ASK_LOG   KV namespace: ASK_LOG   > Save.
3. Add your download password
   Same Settings page > Variables and Secrets > Add > Type: Secret
   Name: ADMIN_TOKEN   Value: a long password only you know (e.g. 20+ random letters) > Save.
   (GEMINI_KEY stays as it is.)
4. Replace the code
   healthcare-pulse-ask > Edit code > select all > paste the whole of worker.js > Deploy.
5. Test
   Ask any question on mayankmadhur.in/ask/. Then open in your browser:
   https://healthcare-pulse-ask.mayankmadhur25.workers.dev/questions?token=YOUR_ADMIN_TOKEN
   A file ask-questions.csv downloads: time (UTC), question, whether it matched an edition.

PART B: WEBSITE FILES (upload after Part A)
   ask.html            > repo root (replace)
   assets/hp-ask.js    > assets/ (replace)
What changed:
   - Every question now goes to the AI, even when no edition matches, so it can still answer
     (with a clearly marked estimate) and the question is saved.
   - While someone is typing, the page only shows matching editions; the AI is called once,
     when they press Ask or Enter. (Before, it called the AI on every typing pause.)
   - A short notice: questions are saved without name, email or location; do not type personal
     health details.
These are your LIVE files with only these changes. The Edition 82 and Edition 83 zips have been
updated with the same changes, so Friday uploads will not undo this.

WHAT GETS SAVED
   Only the question text (first 500 characters), the time, and whether it matched an edition.
   No IP address, no name, no email. Kept for one year, then deleted automatically.

NOTES
   - Past questions before this upgrade cannot be recovered; the old worker did not save them.
   - Free limits: Cloudflare KV allows 1,000 saves a day on the free plan. Above that, saving
     pauses for the day but answers keep working.
   - To change answer style later, edit SYSTEM_PROMPT at the top of worker.js and Deploy again.
