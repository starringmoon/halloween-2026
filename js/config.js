/* main config */
const PARTY_CONFIG = {
  title: "halloween 2026",
  date: "October 31, 2026",
  startTime: "19:00",
  endTime: "02:00",  
  location: "namur",
  dressCode: "spooky costumes or something comfortable",
  description: "you have been invited to a halloween party.",
  googleFormUrl: "https://docs.google.com/spreadsheets/d/1lvMYx1eQ-XrIHwe2FrbKpEjV-Xmnn6oK9_a8QkoyRMU/edit?gid=0#gid=0",
  googleSheetCsvUrl: "https://docs.google.com/spreadsheets/d/1lvMYx1eQ-XrIHwe2FrbKpEjV-Xmnn6oK9_a8QkoyRMU/edit?gid=0#gid=0"
};
const CSV_COLUMNS = { name: "Name", bringing: "What are you bringing?" };
const MANUAL_GUESTS = [{ name: "Guest Name", bringing: "Food / Drink" }];


//sounds

const SOUNDS = {
  music: "assets/freefromfear.mp3", 
  hover: "./assets/sounds/select.wav", 
  click: {
    calendar:      "assets/sounds/paper.wav",
    closet:     "assets/sounds/closet.wav",
    documents:      "./assets/sounds/typewriter.wav",
    typewriter:      "./assets/sounds/typewriter.wav",
    chest: "assets/sounds/chest.wav",
    complete: "assets/sounds/complete.mp3",
  }
};
