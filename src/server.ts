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
    res.send(work);
  } else {
    res.status(404).send({ error: "Work not found" });
  }
});

app.listen(port, () => {
  console.log(`App running: http://localhost:${port}`);
});
