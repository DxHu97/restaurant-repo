const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const hasProperties = require("../errors/hasProperties");
const service = require("./tables.service");
const reservationService = require("../reservations/reservations.service");
const tableProperties = hasProperties("table_name", "capacity")
const updateProperties = hasProperties("reservation_id")

const VALID_PROPERTIES = [
  'table_name',
  'capacity',
  'reservation_id'
]

function hasOnlyValidProperties(req, res, next) {
  const invalidFields = Object.keys(req.body.data).filter(
    (field) => !VALID_PROPERTIES.includes(field)
  );

  if (invalidFields.length) {
    return next({
      status: 400,
      message: `Invalid field(s): ${invalidFields.join(", ")}`,
    });
  }
  next();
}

async function tableExists(req, res, next) {
  const { table_id } = req.params
    const table = await service.read(table_id)
    if (table) {
        res.locals.table = table
        return next()
    }
    next({
        status: 404,
        message: `${table_id} does not exist`
    })
}

async function reservationExists(req, res, next) {
  const { reservation_id } = req.body.data;
  if (!reservation_id) {
    return next({
      status: 400,
      message: `You need a reservation_id`,
    });
  }

  const reservation = await reservationService.read(reservation_id);
  if (reservation) {
    res.locals.reservation = reservation;
    return next();
  }
  next({ 
    status: 404, 
    message: `${reservation_id} does not exist` 
  });
}

function hasData(req, res, next) {
  const { data } = req.body
  if (data) {
      return next()
  }
  next({
      status: 400,
      message: `Data is missing`
  })
}

function hasValidProperties(req, res, next) {
  const { data: { table_name, capacity } } = req.body;
    if (!table_name || table_name.length <= 1) {
      return next({
        status: 400,
        message: `table_name must be at least 2 characters long.`
      });
    }
    if (capacity <= 0) {
      return next({
          status: 400,
          message: `capacity must be greater than 0`
      })
  }
  if (typeof capacity !== 'number') {
      return next({
          status: 400,
          message: `capacity must be a number`
      })
  }
    next();
}

function checkTableStatus(req, res, next) {
  const occupied = res.locals.table.reservation_id;
  const status = res.locals.reservation.status
  const people = res.locals.reservation.people
  const capacity = res.locals.table.capacity

  if (occupied) {
    return next({
      status: 400,
      message: `Table ${res.locals.table.table_id} is occupied. Pick another table`,
    });
  }
  if (status === "seated") {
    return next({
      status: 400,
      message: `This reservation has already been seated`,
    });
  }
  if (people > capacity) {
      return next({
        status: 400,
        message: `This table can't sit ${people} people. Choose another table with higher capacity.`
      });
    }
    next();
}

function checkOccupation(req, res, next) {
  const table  = res.locals.table;
  if (table.reservation_id === null) {
    return next({
      status: 400,
      message: `Table is not occupied`,
    });
  }

  next();
}

async function list(req, res) {
  const data = await service.list();
  res.json({ data });
}

async function create(req, res) {
  const data = await service.create(req.body.data);
  res.status(201).json({ data });
}

async function update(req, res) {
  const { reservation_id } = req.body.data;
  const table_id = Number(req.params.table_id);
  const data = await service.update(reservation_id, table_id);
  res.json({ data });
}

async function destroy(req, res) {
  const { table_id } = req.params;
  const { table } = res.locals;

  await service.destroy(table_id, table.reservation_id);
  res.status(200).json({});
}


module.exports = {
    list: asyncErrorBoundary(list),
    create: [
        hasData,
        hasValidProperties,
        hasOnlyValidProperties,
        tableProperties,
        asyncErrorBoundary(create)
    ],
    update: [
        hasData,
        asyncErrorBoundary(reservationExists),
        asyncErrorBoundary(tableExists),
        updateProperties,
        checkTableStatus,
        asyncErrorBoundary(update),
    ],
    delete: [
        asyncErrorBoundary(tableExists),
        checkOccupation,
        asyncErrorBoundary(destroy)
    ]
}
