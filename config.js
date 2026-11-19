/* ==========================================================================
   WEDDING DETAILS — edit everything in this one file.
   Anything in [SQUARE BRACKETS] is a placeholder to fill in later.

   One site, four invitations. Each copy's <html> tag says which one it is
   (see tools/build-variants.sh):
     data-side   "bride" | "groom"  — whose family is inviting
     data-invite "full"  | "day"    — 17–18 Jan with hotel stay, or 18 Jan only
   ========================================================================== */
window.WEDDING = {
  bride: {
    name: "Srishti",
    fullName: "Srishti Jain",
    city: "New Delhi",
    relation: "Daughter of",
    parents: ["Mrs. Shashi Jain", "Mr. Kamlesh Kumar Jain"],
    parentsOnBrideSide: ["Mrs. Shashi", "Mr. Kamlesh Kumar Jain"],
  },
  groom: {
    name: "Shubham",
    fullName: "Shubham Shamanyu",
    city: "Mumbai",
    relation: "Son of",
    parents: ["Mrs. Sangeeta Prasad", "Mr. Surendra Prasad"],
    parentsOnBrideSide: ["Mrs. Sangeeta", "Mr. Surendra Prasad"],
  },

  hashtag: "#SriShubhVivah",

  hosts: {
    bride: { label: "Bride's side", invocation: "॥ श्री महावीराय नमः ॥" },
    groom: { label: "Groom's side", invocation: "॥ श्री गणेशाय नमः ॥" },
  },
  invites: {
    // countdownTo: when the countdown reaches zero. Keep the +05:30 (IST).
    // travel: show the arrival/departure questions (when false the Sheet gets "N/A" in those columns).
    full: { label: "17–18 Jan (with stay)", displayDate: "17 – 18 January 2027", countdownTo: "2027-01-17T00:01:00+05:30", travel: true },
    day: { label: "18 Jan only", displayDate: "18 January 2027", countdownTo: "2027-01-18T00:01:00+05:30", travel: false },
  },

  venue: {
    name: "Nature Knots",
    address: "Nrithyagram, Hesaraghatta Grass Farm, Bengaluru, Karnataka 560089",
    // Google Maps → Share → copy link
    mapsLink: "https://maps.app.goo.gl/bYrDofh3DhiKNLjR9",
    // Google Maps → Share → Embed a map → copy only the src="..." URL
    mapsEmbed: "https://www.google.com/maps?q=Nature+Knots,+Nrithyagram,+Hesaraghatta,+Bengaluru&output=embed",
  },

  // Day-by-day programme, in order of time.
  //   side: "bride" / "groom" — only on that family's invitations (leave out for both)
  //   day: true               — also on the 18-Jan-only invitations
  //   dress                   — optional dress code
  //   note                    — optional short note under the event
  //   rsvp (per day)          — whether guests tick that day in the RSVP form
  days: [
    {
      label: "Day One", date: "Sunday, 17 January 2027", short: "Sun, 17 Jan", key: "17 Jan", rsvp: true,
      events: [
        { name: "Check-in", hindi: "आगमन", time: "9:00 AM", note: "Please carry an Aadhaar card for every guest for hotel check-in." },
        { name: "Lagan", hindi: "लगन", time: "11:00 AM", side: "bride" },
        { name: "Haldi", hindi: "हल्दी", time: "1:00 PM", dress: "Shades of yellow" },
        { name: "Sangeet", hindi: "संगीत", time: "7:00 PM" },
      ],
    },
    {
      label: "Day Two", dayOnlyLabel: "The Wedding Day", date: "Monday, 18 January 2027", short: "Mon, 18 Jan", key: "18 Jan", rsvp: true,
      events: [
        { name: "Grit Dhaari", hindi: "घृतढारी", time: "8:00 AM", side: "groom" },
        { name: "Bhaat", hindi: "भात", time: "9:00 AM", side: "bride" },
        { name: "Baraat", hindi: "बारात", time: "12:00 PM", side: "groom", day: true },
        { name: "Baraat Swagat", hindi: "बारात स्वागत", time: "1:30 PM", side: "bride", day: true },
        { name: "Varmala", hindi: "वरमाला", time: "3:00 PM", day: true },
        { name: "Phere", hindi: "फेरे", time: "4:30 PM", day: true },
        { name: "Reception", hindi: "स्वागत समारोह", time: "7:00 PM", day: true },
      ],
    },
    {
      label: "Day Three", date: "Tuesday, 19 January 2027", short: "Tue, 19 Jan", key: "19 Jan", rsvp: false,
      events: [
        { name: "Breakfast & Check-out", hindi: "जलपान व प्रस्थान", time: "9:00 AM" },
      ],
    },
  ],

  rsvp: {
    // "Chat with … on WhatsApp" button for guests with questions (one per family's invitation).
    // Country code + number, digits only.
    sides: [
      { name: "Srishti", whatsapp: "919811746546", host: "bride" },
      { name: "Shubham", whatsapp: "918800105169", host: "groom" },
    ],
    // Used if a number above isn't filled in yet.
    fallbackNumber: "917738836237",
    // Google Apps Script Web App URL (see README.md, step 2) — every RSVP is saved in the Google Sheet.
    sheetEndpoint: "https://script.google.com/macros/s/AKfycbxXevmqaALIbCEW3Xc_FlMqs7lAH4VTy6siavBF8szm3Fv-phLzKGVqVaIFyKl3AzvJDw/exec",
    maxGuests: 4, // the guest plus up to 3 more, each named for room allotment
    // Arrival / departure the guest can pick (all optional) — for Divya's pickups and drops.
    travel: {
      arrive: [{ key: "17 Jan", label: "Sun, 17 Jan" }, { key: "18 Jan", label: "Mon, 18 Jan" }],
      leave: [{ key: "18 Jan", label: "Mon, 18 Jan" }, { key: "19 Jan", label: "Tue, 19 Jan" }],
      modes: [{ key: "Flight", label: "✈️ Flight" }, { key: "Train", label: "🚆 Train" }, { key: "Road", label: "🚗 Road" }],
    },
  },

  // Points of contact. host: "bride" / "groom" shows a group only on that family's invitations.
  contacts: [
    { side: "Bride's side", host: "bride", people: [
      { name: "Kamlesh Kumar Jain", relation: "Father of the bride", phone: "+91 98111 17276" },
      { name: "Kanishk Jain", relation: "Brother of the bride", phone: "+91 83830 34996" },
    ] },
    { side: "Groom's side", host: "groom", people: [
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
