/* ------------------------------------------------------------------
 * MUHAMMAD BILAL & FATIMA WAHEED — wedding details
 * Saari details SIRF isi file me hain. Kuch badalna ho to yahin
 * badlein, save karein, dobara build/deploy karein — bas.
 * ------------------------------------------------------------------ */

export interface TimelineEvent {
  day: string;
  time: string;
  title: string;
  urdu: string;
  note: string;
  noteUrdu: string;
}

export interface Venue {
  tag: string;
  tagUrdu: string;
  name: string;
  nameUrdu: string;
  address: string;
  addressUrdu: string;
  mapQuery: string;
  mapUrl: string;
}

export interface RsvpContact {
  name: string;
  phone: string;
}

export const wedding = {
  groom: "Bilal Aslam",
  groomUrdu: "بلال اسلم",
  groomFamily: "",
  groomFamilyUrdu: "",
  bride: "Fatima Waheed",
  brideUrdu: "فاطمہ وحید",
  brideFamily: "",
  brideFamilyUrdu: "",

  heroIntro: "Together with their families\nrequest the honour of your presence",
  heroIntroUrdu: "اپنے اہل خانہ کے ساتھ\nآپ کی تشریف آوری کے خواستگار ہیں",

  welcome:
    "Two souls, one beautiful journey.\nJoin us as we begin our forever —\nwith your love, laughter and precious duas.",
  welcomeUrdu:
    "دو دل، ایک خوبصورت سفر۔\nہماری نئی زندگی کے آغاز میں\nاپنی محبتوں اور دعاؤں کے ساتھ شریک ہوں۔",

  // Scratch-to-reveal heart
  dateText: "6 – 7 March 2027",
  day: "Saturday & Sunday",
  time: "Mehndi 6 PM · Shalima 1 PM",

  // Punctuality note — Program Timeline section ke neeche
  punctuality: "Kindly arrive on time — your punctuality helps us begin the celebrations promptly and enjoy every moment together. ♥",
  punctualityUrdu: "براہِ کرم وقت پر تشریف لائیں — آپ کی پابندیِ وقت سے تقریب بروقت شروع ہوگی اور ہم سب مل کر ہر لمحہ لطف اٹھا سکیں گے۔ ♥",

  // Countdown + Save-the-date target (pehli taqreeb — Mehndi)
  date: "2027-03-06T18:00:00+05:00",
  venue: "Ivory Pearl Hall",
  address: "Mehndi Venue",

  timeline: [
    {
      day: "Saturday, 6 March 2027",
      time: "6:00 PM",
      title: "Mehndi",
      urdu: "مہندی",
      note: "",
      noteUrdu: "",
    },
    {
      day: "Sunday, 7 March 2027",
      time: "1:00 PM",
      title: "Shalima",
      urdu: "شالیمہ",
      note: "",
      noteUrdu: "",
    },
  ] as TimelineEvent[],

  venues: [
    {
      tag: "Mehndi",
      tagUrdu: "مہندی",
      name: "Ivory Pearl Hall",
      nameUrdu: "ایوری پرل ہال",
      address: "Saturday, 6 March 2027 · 6:00 PM onwards",
      addressUrdu: "ہفتہ، 6 مارچ 2027 · شام 6 بجے سے",
      mapQuery: "Ivory Pearl Hall",
      mapUrl: "https://www.google.com/maps/search/?api=1&query=Ivory+Pearl+Hall",
    },
    {
      tag: "Shalima",
      tagUrdu: "شالیمہ",
      name: "Blossom Garden Marquee",
      nameUrdu: "بلاسم گارڈن مارکی",
      address: "Sunday, 7 March 2027 · 1:00 PM onwards",
      addressUrdu: "اتوار، 7 مارچ 2027 · دوپہر 1 بجے سے",
      mapQuery: "Blossom Garden Marquee",
      mapUrl: "https://www.google.com/maps/search/?api=1&query=Blossom+Garden+Marquee",
    },
  ] as Venue[],

  preEvents: [] as TimelineEvent[],

  transportation:
    "Ample parking is available at both venues. Guests travelling from out of town, please contact us and we will help arrange transport.",
  accommodation:
    "Out-of-town guests, please let us know in your RSVP and we will arrange comfortable accommodation near the venues.",
  gifts:
    "Your presence is the greatest gift. Should you wish to honour us with a gift, a contribution towards our new beginning would be warmly appreciated.",

  // RSVP rabta numbers — ASLI numbers yahan likhein
  rsvpContacts: [
    { name: "Bilal's Family", phone: "+92 300 0000000" },
    { name: "Fatima's Family", phone: "+92 300 0000000" },
  ] as RsvpContact[],

  lookingForward: "Bilal Aslam & Fatima Waheed",
  lookingForwardUrdu: "بلال اسلم اور فاطمہ وحید",
};
