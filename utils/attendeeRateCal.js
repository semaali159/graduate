const db = require("../models");
async function calculateAttendanceRate(eventId) {
  try {
    const event = await db.attendee.findAll({ where: { eventId: eventId } });
    if (!event) {
      throw new Error("event not found");
    }
    console.log(event);
    const rawEvent = await db.publicEvent.findByPk(eventId);
    const totalSeatsBooked =
      (await db.attendee.sum("seats", { where: { eventId } })) || 0;
    console.log(totalSeatsBooked);
    console.log(rawEvent.tickets);
    const attendanceRate =
      rawEvent.tickets > 0
        ? ((totalSeatsBooked / rawEvent.tickets) * 100).toFixed(2)
        : 0;
    console.log(attendanceRate);

    return {
      //   eventId: event.id,
      //   eventName: event.name,
      //   totalTickets: event.tickets,
      //   bookedSeats: totalSeatsBooked,
      attendanceRate: `${attendanceRate}%`,
    };
  } catch (error) {
    console.error("error", error.message);
    throw error;
  }
}

module.exports = calculateAttendanceRate;
