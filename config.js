/* ==========================================================================
   WEDDING DETAILS — edit everything in this one file.
   Anything in [SQUARE BRACKETS] is a placeholder to fill in later.
   ========================================================================== */
window.WEDDING = {
  bride: {
    name: "Srishti",
    fullName: "Srishti Jain",
    city: "New Delhi",
    relation: "Daughter of",
    parents: ["Mrs. Shashi Jain", "Mr. Kamlesh Kumar Jain"],
  },
  groom: {
    name: "Shubham",
    fullName: "Shubham Shamanyu",
    city: "Bihar",
    relation: "Son of",
    parents: ["Mrs. Sangeeta Prasad", "Mr. Surendra Prasad"],
  },

  hashtag: "#SriShubhVivah",

  // Main wedding muhurat — drives the countdown. Keep the +05:30 (IST).
  weddingDate: "2027-01-18T18:00:00+05:30",

  // Two invitations from the same site:
  //   "full" — main link, guests with a hotel stay (17–18 Jan, check-out 19 Jan)
  //   "day"  — shubhavee.github.io/sri-shubh-vivah/ (separate repo, see tools/build-day-invite.sh), 18 Jan only
  invites: {
    full: { label: "17–18 Jan (with stay)", displayDate: "17 – 19 January 2027" },
    day: { label: "18 Jan only", displayDate: "18 January 2027" },
  },

  venue: {
    name: "Nature Knots",
    address: "Nrithyagram, Hesaraghatta Grass Farm, Bengaluru, Karnataka 560089",
    // Google Maps → Share → copy link
    mapsLink: "https://maps.app.goo.gl/bYrDofh3DhiKNLjR9",
    // Google Maps → Share → Embed a map → copy only the src="..." URL
    mapsEmbed: "https://www.google.com/maps?q=Nature+Knots,+Nrithyagram,+Hesaraghatta,+Bengaluru&output=embed",
  },

  // Day-by-day programme, in order of time. Replace "[Time]" once fixed.
  // invites: which invitation shows this day. rsvp: whether guests tick it in the RSVP form.
  // dress is optional — leave it out for no dress code.
  days: [
    {
      label: "Day One", date: "Sunday, 17 January 2027", short: "Sun, 17 Jan", key: "17 Jan",
      invites: ["full"], rsvp: true,
      events: [
        { name: "Check-in", hindi: "आगमन", period: "Morning", time: "9:00 AM" },
        { name: "Puja", hindi: "पूजा", period: "Morning", time: "[Time]" },
        { name: "Haldi", hindi: "हल्दी", period: "Afternoon", time: "[Time]", dress: "Shades of yellow" },
        { name: "Sangeet", hindi: "संगीत", period: "Night", time: "[Time]" },
      ],
    },
    {
      label: "Day Two", dayOnlyLabel: "The Wedding Day", date: "Monday, 18 January 2027", short: "Mon, 18 Jan", key: "18 Jan",
      invites: ["full", "day"], rsvp: true,
      events: [
        { name: "Puja", hindi: "पूजा", period: "Morning", time: "[Time]" },
        { name: "Baraat", hindi: "बारात", period: "Afternoon", time: "[Time]" },
        { name: "Vivah", hindi: "विवाह", period: "Evening", time: "[Time]" },
        { name: "Reception", hindi: "स्वागत समारोह", period: "Night", time: "[Time]" },
      ],
    },
    {
      label: "Day Three", date: "Tuesday, 19 January 2027", short: "Tue, 19 Jan", key: "19 Jan",
      invites: ["full"], rsvp: false,
      events: [
        { name: "Check-out", hindi: "प्रस्थान", period: "Morning", time: "9:00 AM" },
      ],
    },
  ],

  rsvp: {
    // "Chat with … on WhatsApp" buttons for guests with questions.
    // Country code + number, digits only.
    sides: [
      { name: "Srishti", whatsapp: "919811746546" },
      { name: "Shubham", whatsapp: "918800105169" },
    ],
    // Used if a side's number above isn't filled in yet.
    fallbackNumber: "917738836237",
    // Paste the Google Apps Script Web App URL here (see README.md, step 2)
    // so every RSVP is also saved privately in your Google Sheet.
    sheetEndpoint: "https://script.google.com/macros/s/AKfycbxXevmqaALIbCEW3Xc_FlMqs7lAH4VTy6siavBF8szm3Fv-phLzKGVqVaIFyKl3AzvJDw/exec",
  },

  // Points of contact shown on the site
  contacts: [
    { side: "Bride's side", people: [
      { name: "Kamlesh Kumar Jain", relation: "Father of the bride", phone: "+91 98111 17276" },
      { name: "Kanishk Jain", relation: "Brother of the bride", phone: "+91 83830 34996" },
    ] },
    { side: "Groom's side", people: [
      { name: "Surendra Prasad", relation: "Father of the groom", phone: "+91 77380 12309" },
      { name: "Shubhika Shubhavee", relation: "Sister of the groom", phone: "+91 77388 36237" },
    ] },
    { side: "Wedding planner", people: [
      { name: "Divya", relation: "Travel & stay", phone: "+91 97390 16719" },
    ] },
  ],

  // Background music. Either drop an mp3 at `music` (preferred), OR paste a YouTube
  // link/ID in `musicYouTube` (used only when the mp3 is missing). Button hides if neither works.
  music: "assets/music.mp3",
  musicYouTube: "https://www.youtube.com/watch?v=3qpxJEp4Ec4", // Kudmayi (Film Version), Saregama
  musicStart: 6, // seconds to skip at the start (also used when it loops)
};
