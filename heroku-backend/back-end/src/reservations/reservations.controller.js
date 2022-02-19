const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const hasProperties = require("../errors/hasProperties");
const service = require("./reservations.service");

const VALID_PROPERTIES = [
  "first_name",
  "last_name",
  "mobile_number",
  "reservation_date",
  "reservation_time",
  "people",
  "status",
  "reservation_id",
  "created_at",
  "updated_at",
];

function hasOnlyValidProperties(req, res, next) {
    const { data = {} } = req.body;
  
    const invalidFields = Object.keys(data).filter((field) => !VALID_PROPERTIES.includes(field));
    
    if(invalidFields.length) 
      return next({
        status: 400,
        message: `Invalid Field(s): ${invalidFields.join(", ")} `,
      });
    next();
  }

const isMissing = hasProperties(
  "first_name",
  "last_name",
  "mobile_number",
  "reservation_date",
  "reservation_time",
  "people"
);


async function list(req, res) {
  const { date } = req.query
  const { mobile_number } = req.query

  let data
  if (date) {
    data = await service.listDate(date)
  } else if (mobile_number) {
    data = await service.search(mobile_number)
  } else {
    data = await service.list()
  }
  res.json({ data });
}


async function read(req, res) {
  const { reservation } = res.locals;
  res.json({ data: reservation });
}

async function create(req, res) {
  const data = await service.create(req.body.data)
  res.status(201).json({ data })
}

async function updateStatus(req, res) {
  const { reservation_id } = res.locals.reservation;
  const { status } = req.body.data;
  const data = await service.updateStatus(reservation_id, status);
  res.json({ data });
}

async function update(req, res) {
  const { reservation_id } = res.locals.reservation;

  const updatedReservation = {
    ...req.body.data,
    reservation_id,
  };
  const data = await service.update(updatedReservation);
  res.json({ data });
}

function hasValidProperties(req, res, next) {
  const { reservation_date, reservation_time, people } = req.body.data;
  const isNumber = Number.isInteger(people);
  let day = `${reservation_date}  ${reservation_time}`;
  let today = new Date();
  let date = new Date(day);

  const timeFormat = /^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;
  const dateFormat = /^\d{4}\-\d{1,2}\-\d{1,2}$/;

  if (!isNumber || people <= 0) {
    return next({
      status: 400,
      message: "You must make a reservation for 1 or more people",
    });
  }

  if (!reservation_date.match(dateFormat)) {
    return next({
      status: 400,
      message: `reservation_date is not a valid date!`,
    });
  }
  if (date.getDay() === 2) {
    return next({
      status: 400,
      message: `The restaurant is closed on Tuesdays.`,
    });
  }
  if (date < today) {
    return next({
      status: 400,
      message: "Reservation must be for a future date.",
    });
  }

  if (!reservation_time.match(timeFormat)) {
    return next({
      status: 400,
      message: `reservation_time is invalid`,
    });
  }

  if (reservation_time < "10:30" || reservation_time > "21:30") {
    return next({
      status: 400,
      message: "The restaurant is only open from 10:30AM and 9:30PM.",
    });
  }
  next()
}

function bookedStatus(req, res, next) {
  const { status } = req.body.data;
  if (status) {
    if (status !== "booked") {
      return next({
        status: 400,
        message: `You can't make a new reservation with the status: ${status}`,
      });
    }
  }
  next();
}

function finished(req, res, next) {
  const { status } = res.locals.reservation
  if (status === 'finished') {
    return next({
      status: 400,
      message: `Can't update a finished reservation`
    })
  }
  next()
}

function validStatus(req, res, next) {
  const { status } = req.body.data
  const statuses = ['booked', 'seated', 'finished', 'cancelled']
  if (statuses.includes(status)) {
    return next()
  }
  next({
    status: 400,
    message: `Invalid status: ${status}. Status must be one of these:${statuses.join(", ")}.`
  })
}

async function reservationExists(req, res, next) {
  const { reservationId } = req.params
  const reservation = await service.read(reservationId)

  if (reservation) {
    res.locals.reservation = reservation
    return next()
  }
  next({
    status: 404,
    message: `Reservation'${reservationId}' not found.`
  })
}

module.exports = {
  list: [asyncErrorBoundary(list)],
  create: [
    isMissing,
    hasOnlyValidProperties,
    bookedStatus,
    hasValidProperties,
    asyncErrorBoundary(create),
  ],
  read: [asyncErrorBoundary(reservationExists), asyncErrorBoundary(read)],
  update: [
    asyncErrorBoundary(reservationExists),
    isMissing,
    bookedStatus,
    hasValidProperties,
    asyncErrorBoundary(update),
  ],
  updateStatus: [
    asyncErrorBoundary(reservationExists),
    asyncErrorBoundary(validStatus),
    validStatus,
    finished,
    asyncErrorBoundary(updateStatus),
  ],
};
