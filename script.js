const timeZones = [
  { label: "Local Time", timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone },
  { label: "Singapore", timeZone: "Asia/Singapore" },
  { label: "Dubai", timeZone: "Asia/Dubai" },
  { label: "Jakarta", timeZone: "Asia/Jakarta" },
  { label: "Japan", timeZone: "Asia/Tokyo" },
];

const cardsContainer = document.getElementById("cards");

function createCard(place) {
  const card = document.createElement("article");
  card.className = "card";

  const city = document.createElement("div");
  city.className = "city";
  city.textContent = place.label;

  const tz = document.createElement("div");
  tz.className = "timezone";
  tz.textContent = "";            // will set to GMT+X

  const timeEl = document.createElement("div");
  timeEl.className = "time";

  const dateEl = document.createElement("div");
  dateEl.className = "date";

  card.appendChild(city);
  card.appendChild(tz);
  card.appendChild(timeEl);
  card.appendChild(dateEl);

  place._timeEl = timeEl;
  place._dateEl = dateEl;
  place._tzEl = tz;

  return card;
}

// Gets something like "GMT+5:30" or "UTC+5:30" depending on locale.[web:21][web:25]
function getGmtOffsetLabel(timeZone) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone,
    timeZoneName: "shortOffset"
  }).formatToParts(new Date());   // needs modern browsers.[web:21][web:24]

  const tzPart = parts.find(p => p.type === "timeZoneName");
  return tzPart ? tzPart.value : timeZone;
}

function formatForZone(date, timeZone) {
  const time = new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    timeZone
  }).format(date);

  const dayDate = new Intl.DateTimeFormat("en-GB", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "2-digit",
    timeZone
  }).format(date);

  return { time, dayDate };
}

function updateAll() {
  const now = new Date();
  for (const place of timeZones) {
    const { time, dayDate } = formatForZone(now, place.timeZone);
    place._timeEl.textContent = time;
    place._dateEl.textContent = dayDate;

    // Update GMT label once (or you can cache it)
    if (!place._offsetLabel) {
      place._offsetLabel = getGmtOffsetLabel(place.timeZone);
    }
    place._tzEl.textContent = place._offsetLabel;
  }
}

// Initial render
for (const place of timeZones) {
  const card = createCard(place);
  cardsContainer.appendChild(card);
}

updateAll();
setInterval(updateAll, 1000);

