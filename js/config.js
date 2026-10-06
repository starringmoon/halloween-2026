/* =========================================================
   🎃 HALLOWEEN INVITATION CUSTOMIZATION  (js/config.js)
   ⭐ Edit ONLY this file to customize the invitation.
   ========================================================= */
const PARTY_CONFIG = {
  title: "halloween 2026",
  date: "October 31, 2026",
  startTime: "19:00",            // 24h HH:MM
  endTime: "02:00",              // earlier than start = next day
  location: "namur",
  dressCode: "spooky costumes or something comfortable",
  description: "you have been invited to a halloween party.",
  googleFormUrl: "https://docs.google.com/spreadsheets/d/1lvMYx1eQ-XrIHwe2FrbKpEjV-Xmnn6oK9_a8QkoyRMU/edit?gid=0#gid=0",
  googleSheetCsvUrl: "https://docs.google.com/spreadsheets/d/1lvMYx1eQ-XrIHwe2FrbKpEjV-Xmnn6oK9_a8QkoyRMU/edit?gid=0#gid=0"
};
const CSV_COLUMNS = { name: "Name", bringing: "What are you bringing?" };
const MANUAL_GUESTS = [{ name: "Guest Name", bringing: "Food / Drink" }];

// Sounds. Paths are relative to invite.html. Names are case-sensitive on most hosts.
const SOUNDS = {
  music: "assets/freefromfear.mp3",     // background loop
  hover: "./assets/sounds/select.wav",    // same on every hotspot
  click: {                              // one per hotspot (id = data-id in invite.html)
    calendar:      "assets/sounds/paper.wav",
    closet:     "assets/sounds/closet.wav",
    documents:      "./assets/sounds/typewriter.wav",
    typewriter:      "./assets/sounds/typewriter.wav",
    chest: "assets/sounds/chest.wav",
    complete: "assets/sounds/complete.mp3",
  }
};
