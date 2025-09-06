const { Op, Sequelize } = require("sequelize");
const asyncHandler = require("express-async-handler");
const db = require("../../models");
const colors = [
  { backgroundColor: "#D4ECDD", textColor: "#1B4332" },
  { backgroundColor: "#FDE2E4", textColor: "#8B0000" },
  { backgroundColor: "#FFF3B0", textColor: "#7A5C00" },
  { backgroundColor: "#EADCF8", textColor: "#4B0082" },
];

function getRandomColor() {
  return colors[Math.floor(Math.random() * colors.length)];
}
const getEventForCalendar = asyncHandler(async (req, res) => {
  try {
    const events = await db.publicEvent.findAll();

    const formattedEvents = events.map((event) => {
      const { backgroundColor, textColor } = getRandomColor();
      const startDateTime = new Date(event.date);
      const endDateTime = new Date(event.date);
      if (event.time) {
        const [hours, minutes, seconds] = event.time.split(":");
        startDateTime.setHours(hours, minutes, seconds || 0);
        endDateTime.setHours(hours, parseInt(minutes) + 60, seconds || 0);
      }

      return {
        title: event.name,
        start: startDateTime.toISOString(),
        end: endDateTime.toISOString(),
        backgroundColor,
        textColor,
      };
    });

    return res.status(200).json({ events: formattedEvents });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "something gets wrong" });
  }
});
module.exports = { getEventForCalendar };
