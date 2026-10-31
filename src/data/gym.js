// Every fact about the gym lives in this file, so updating the site means editing it here.
// Sources: the gym's Facebook page (facebook.com/TheFirstGym1) and its Google Maps listing.
// `null` marks something the gym hasn't published yet: the site shows a "to be added"
// marker in its place until the value is filled in.

export const GYM = {
  name: "The First Gym",
  tagline: { en: "Your first place to be a hero", ar: "مكانك الأول لتكون بطلًا" },
  // The word the gym asks people to send on WhatsApp to claim the current offer
  offerWord: "START",
  phone: "01155017245",
  whatsapp: "201155017245",
  instagram: "thefirst_gym",
  facebook: "TheFirstGym1",
  address: {
    en: "End of El Salam Street, Hay El Mostasharin extension, Zagazig, Sharqia",
    ar: "آخر شارع السلام، امتداد حي المستشارين، الزقازيق، الشرقية",
  },
  landmark: {
    en: "Opposite the Delta Heart and Catheterization Center, next to Kozaki Café",
    ar: "أمام مركز دلتا للقلب والقسطرة، بجوار كافيه كوزاكي",
  },
  geo: { lat: 30.5928708, lng: 31.4809817 },
  // Google Maps place id (cid) of the gym's listing
  mapsCid: "8001756715929445261",
  hours: {
    // Facebook says "open 7 days a week" without times. These times come from the
    // Google Maps listing; set `confirmed` to true once the gym confirms them.
    confirmed: false,
    // Saturday first, the Egyptian week. A close time earlier than the open time runs past midnight.
    week: [
      { open: "07:30", close: "03:00" },
      { open: "07:30", close: "03:00" },
      { open: "07:30", close: "03:00" },
      { open: "07:30", close: "03:00" },
      { open: "07:30", close: "03:00" },
      { open: "07:30", close: "03:00" },
      { open: "15:00", close: "01:00" },
    ],
  },
};

export const AUDIENCES = ["men", "women", "kids"];

export const PROGRAMS = [
  {
    id: "fitness",
    name: { en: "Fitness", ar: "فتنس" },
    for: ["men", "women", "kids"],
    coach: "osama",
    about: {
      en: "A high-energy group workout that keeps you going to the last rep.",
      ar: "تمرين جماعي بطاقة عالية يساعد على الاستمرار حتى آخر عدة.",
    },
  },
  {
    id: "kickboxing",
    name: { en: "Kickboxing", ar: "كيك بوكس" },
    for: ["men", "women", "kids"],
    coach: "tamer",
    about: {
      en: "Technique, pace and a workout to enjoy, whether it's a first class or years of training.",
      ar: "تكنيك وحماس وتمرين ممتع، سواء كانت أول مرة أو بعد سنوات من التمرين.",
    },
  },
  {
    id: "mma",
    name: { en: "MMA", ar: "MMA" },
    for: ["men", "women", "kids"],
    coach: null,
    about: {
      en: "Mixed martial arts: striking and grappling in one class.",
      ar: "فنون قتالية مختلطة تجمع الضربات والمصارعة في كلاس واحد.",
    },
  },
  {
    id: "zumba",
    name: { en: "Zumba", ar: "زومبا" },
    for: ["women"],
    coach: "nada",
    about: {
      en: "Music, movement and a better mood from the first minute, while burning calories.",
      ar: "مزيكا وحركة ومود أحلى من أول دقيقة، مع حرق السعرات.",
    },
  },
  {
    id: "aerobics",
    name: { en: "Aerobics", ar: "إيروبكس" },
    for: ["women"],
    coach: null,
    about: {
      en: "A cardio class set to music to build stamina.",
      ar: "كلاس كارديو على المزيكا لرفع التحمل.",
    },
  },
  {
    id: "yoga",
    name: { en: "Yoga", ar: "يوجا" },
    for: ["women"],
    coach: null,
    freeForMembers: true,
    about: {
      en: "Strength, balance and flexibility at a slower pace.",
      ar: "قوة وتوازن ومرونة بإيقاع أهدأ.",
    },
  },
  {
    id: "dance",
    name: { en: "Dance", ar: "دانس" },
    for: ["women"],
    coach: null,
    about: {
      en: "Dance workouts that feel more like fun than training.",
      ar: "تمارين رقص أقرب للمتعة منها للتمرين.",
    },
  },
];

export const COACHES = [
  { id: "osama", name: { en: "Capt. Osama", ar: "كابتن أسامة" }, photo: null },
  { id: "tamer", name: { en: "Capt. Mohamed Tamer", ar: "كابتن محمد تامر" }, photo: null },
  { id: "nada", name: { en: "Capt. Nada", ar: "كابتن ندى" }, photo: null },
];

// Published class times. Days count from Saturday (0) to Friday (6);
// time null means the gym posted the days but not the time.
export const SCHEDULE = [
  { program: "fitness", days: [0, 2, 4], time: "22:00" },
  { program: "kickboxing", days: [0, 2, 4], time: null },
];

export const FACILITIES = [
  {
    group: "train",
    items: [
      { id: "machines", icon: "dumbbell", label: { en: "American strength and cardio machines", ar: "أجهزة حديد وكارديو أمريكية" } },
      { id: "area", icon: "boxing", label: { en: "Class and boxing area", ar: "منطقة للكلاسات والبوكسينج" } },
      { id: "inbody", icon: "scan", label: { en: "InBody body-composition scans", ar: "قياس InBody لتكوين الجسم" } },
      { id: "floor", icon: "coach", label: { en: "Coaches on the floor, no PT fee", ar: "كباتن في الصالة بدون اشتراك PT" } },
      { id: "mixed", icon: "team", label: { en: "Male and female coaches", ar: "كباتن رجال وسيدات" } },
    ],
  },
  {
    group: "recover",
    items: [
      { id: "sauna", icon: "steam", label: { en: "Sauna and steam", ar: "ساونا واستيم" } },
      { id: "lounge", icon: "lounge", label: { en: "Members' lounge", ar: "استراحة للأعضاء" } },
      { id: "cafe", icon: "cafe", label: { en: "Cafeteria with drinks and food", ar: "كافيتريا للمشروبات والمأكولات" } },
      { id: "store", icon: "store", label: { en: "Supplements store", ar: "متجر للمكملات الغذائية" } },
    ],
  },
  {
    group: "practical",
    items: [
      { id: "ac", icon: "snow", label: { en: "Fully air-conditioned", ar: "مكيف بالكامل" } },
      { id: "lockers", icon: "lock", label: { en: "Lockers and changing rooms", ar: "لوكرات لتغيير الملابس" } },
      { id: "wifi", icon: "wifi", label: { en: "Free Wi-Fi", ar: "واي فاي مجاني" } },
      { id: "parking", icon: "car", label: { en: "Large parking area", ar: "باركينج واسع" } },
      { id: "pay", icon: "card", label: { en: "Pay by card or cash", ar: "الدفع بالفيزا أو كاش" } },
      { id: "vip", icon: "crown", label: { en: "VIP service", ar: "خدمة VIP" } },
    ],
  },
];

// Plan lengths the gym sells. Prices aren't published.
export const PLANS = [
  { id: "1m", months: 1, price: null },
  { id: "3m", months: 3, price: null },
  { id: "6m", months: 6, price: null },
  { id: "12m", months: 12, price: null },
];

// In-house challenges the gym ran (from its Facebook posts)
export const CHALLENGES = [
  {
    id: "wrist-plank",
    date: "2026-09-19",
    name: { en: "Arm wrestling + plank", ar: "ريست + بلانك" },
    prizes: [
      { cash: 1000, months: 3 },
      { cash: 500, months: 1 },
      { cash: 0, months: 1 },
    ],
  },
  {
    id: "wrist-hold",
    date: "2026-09-26",
    time: "22:00",
    name: { en: "Arm wrestling and weighted hold", ar: "ريست وثبات بالوزن" },
    upTo: 5000,
  },
];

// Photos of the gym: put files in public/photos/ and list them here, e.g.
// { src: "/photos/floor.webp", width: 1600, height: 1067, alt: { en: "…", ar: "…" } }
export const GALLERY = [];

export const FAQ = [
  {
    q: { en: "Do I need a personal-training subscription to get help?", ar: "هل أحتاج اشتراك تدريب شخصي للحصول على متابعة؟" },
    a: {
      en: "No. Coaches are on the floor to follow up and correct your exercises at no extra cost.",
      ar: "لا. الكباتن موجودون في الصالة للمتابعة وتصحيح التمارين بدون تكلفة إضافية.",
    },
  },
  {
    q: { en: "Are there classes for women and kids?", ar: "هل توجد كلاسات للسيدات والأطفال؟" },
    a: {
      en: "Yes. Fitness, Kickboxing and MMA run for men, women and kids. Zumba, Aerobics, Yoga and Dance are for women, and there are female coaches too.",
      ar: "نعم. الفتنس والكيك بوكس والـMMA للشباب والسيدات والأطفال، والزومبا والإيروبكس واليوجا والدانس للسيدات، ويوجد كباتن سيدات أيضًا.",
    },
  },
  {
    q: { en: "Which days is the gym open?", ar: "ما أيام العمل؟" },
    a: { en: "Every day of the week. The opening hours are on this page.", ar: "كل أيام الأسبوع، والمواعيد موضحة في هذه الصفحة." },
  },
  {
    q: { en: "How can I pay?", ar: "ما طرق الدفع؟" },
    a: { en: "By card (Visa) or cash.", ar: "بالفيزا أو كاش." },
  },
  {
    q: { en: "Is there parking?", ar: "هل يوجد مكان لركن السيارات؟" },
    a: { en: "Yes, there's a large parking area.", ar: "نعم، يوجد باركينج واسع." },
  },
  {
    q: { en: "Can I measure my body composition?", ar: "هل يمكن قياس تكوين الجسم؟" },
    a: {
      en: "Yes. The gym's InBody device measures muscle mass, body fat, water, weight and more.",
      ar: "نعم. جهاز InBody في الجيم يقيس كتلة العضلات ونسبة الدهون والمياه والوزن ومؤشرات أخرى.",
    },
  },
  {
    q: { en: "What is there besides training?", ar: "ماذا يوجد غير التمرين؟" },
    a: {
      en: "Sauna and steam, lockers, a members' lounge, a cafeteria, a supplements store and free Wi-Fi. The whole gym is air-conditioned.",
      ar: "ساونا واستيم، ولوكرات، واستراحة للأعضاء، وكافيتريا، ومتجر مكملات غذائية، وواي فاي مجاني، والجيم مكيف بالكامل.",
    },
  },
  {
    q: { en: "How do I join or get the current offer?", ar: "كيف أشترك أو أحصل على العرض الحالي؟" },
    a: {
      en: "Send the word START on WhatsApp or call the gym. Both buttons are on this page.",
      ar: "أرسلوا كلمة START على واتساب أو اتصلوا بالجيم من الأزرار الموجودة في هذه الصفحة.",
    },
  },
];
