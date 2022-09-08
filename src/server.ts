import cors from "cors";
import express from "express";
import Database from "better-sqlite3";

const app = express();
app.use(cors());
app.use(express.json());
const db = Database("./db/data.db", { verbose: console.log });

const port = 5000;

const getMuseums = db.prepare(`
SELECT * FROM museums
`);
const getWorksForMuseum = db.prepare(`
SELECT * FROM works WHERE museumId = @museumId
`);
const getMuseumById = db.prepare(`
SELECT * FROM museums WHERE id = @id
`);
const getWorks = db.prepare(`
SELECT * FROM works
`);
const getWorkById = db.prepare(`
SELECT * FROM works WHERE id = @id
`);
const createMuseum = db.prepare(`
INSERT INTO museums (name, city) VALUES (@name, @city)
`);

// this is the query for challange 1 but I don't know how to make it work 🙄(something with post probably)
const createWork = db.prepare(`
INSERT INTO works (name, museumId, image) VALUES (@name, @museumId, @image)
`);

const moveWork = db.prepare(`
UPDATE works SET museumId = @museumId WHERE id = @id
`);
app.get("/", (req, res) => {
  res.send("Welcome to my app!");
});
app.get("/museums", (req, res) => {
  const museums = getMuseums.all();
  for (let museum of museums) {
    const works = getWorksForMuseum.all({ museumId: museum.id });
    museum.works = works;
  }
  res.send(museums);
});
app.get("/museums/:id", (req, res) => {
  const museum = getMuseumById.get(req.params);
  if (museum) {
    const works = getWorksForMuseum.all({ museumId: museum.id });
    museum.works = works;
    res.send(museum);
  } else {
    res.status(404).send({ error: "Museum not found" });
  }
});
app.get("/works", (req, res) => {
  const works = getWorks.all();
  for (let work of works) {
    const museum = getMuseumById.get({ id: work.museumId });
    work.museum = museum;
  }
  res.send(works);
});
app.get("/works/:id", (req, res) => {
  const work = getWorkById.get(req.params);
  if (work) {
    const museum = getMuseumById.get({ id: work.museumId });
    work.museum = museum;
    res.send(work);
  } else {
    res.status(404).send({ error: "Work not found" });
  }
});

app.post("/museums", (req, res) => {
  const errors: string[] = [];
  if (typeof req.body.name !== "string") {
    errors.push("Name not provided or not a string");
  }
  if (typeof req.body.city !== "string") {
    errors.push("City not provided or not a string");
  }

  if (errors.length === 0) {
    const info = createMuseum.run(req.body);
    const museum = getMuseumById.get({ id: info.lastInsertRowid });
    const works = getWorksForMuseum.all({ museumId: museum.id });
    museum.works = works;
    res.send(museum);
  } else {
    res.status(400).send({ errors });
  }
});
app.post("/works", (req, res) => {
  const errors: string[] = [];
  if (typeof req.body.name !== "string") {
    errors.push("Name not provided or not a string");
  }
  if (typeof req.body.museumId !== "number") {
    errors.push("MuseumId not provided or not a number");
  }
  if (typeof req.body.image !== "string") {
    errors.push("Image not provided or not a string");
  }

  if (errors.length === 0) {
    const info = createWork.run(req.body);
    const work = getWorkById.get({ id: info.lastInsertRowid });
    const museum = getMuseumById.get({ id: work.museumId });
    work.museum = museum;
    res.send(work);
  } else {
    res.status(400).send({ errors });
  }
});

// app.patch("/works", (req, res) => {});
app.listen(port, () => {
  console.log(`App running: http://localhost:${port}`);
});
