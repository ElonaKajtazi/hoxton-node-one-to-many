import Database from "better-sqlite3";
const db = Database("./db/data.db", { verbose: console.log });

const museums = [
  {
    name: "Louvre",
    city: "Paris",
  },
  {
    name: "Van Gogh",
    city: "Amsterdam",
  },
  {
    name: "British Museum",
    city: "London",
  },
  {
    name: "Muzeu Etnologjik",
    city: "Prishtinë",
  },
];

const works = [
  {
    name: "The Raft of the Medusa",
    image: "https://cdn.pariscityvision.com/library/image/5458.jpg",
    museumId: 1,
  },
  {
    name: "The Mona Lisa",
    image: "https://cdn.pariscityvision.com/library/image/5449.jpg",
    museumId: 1,
  },
  {
    name: "The Potato Eaters",
    image:
      "https://www.dailyartmagazine.com/wp-content/uploads/2020/04/Vincent-van-Gogh-The-Potato-Eaters-1885-Van-Gogh-Museum-Amsterdam.jpg",
    museumId: 2,
  },
  {
    name: "Women on the Peat Moor",
    image:
      "https://www.dailyartmagazine.com/wp-content/uploads/2020/04/Vincent-van-Gogh-Women-on-the-Peat-Moor-1883-Van-Gogh-Museum-Amsterdam.jpg",
    museumId: 2,
  },
  {
    name: "Rosetta Stone",
    image:
      "https://blog.britishmuseum.org/wp-content/uploads/2020/08/xESG-Rosetta-Stone-square.jpg.pagespeed.ic.zrsHKMbwI1.webp",
    museumId: 3,
  },
  {
    name: "Sophilos Vase",
    image:
      "https://blog.britishmuseum.org/wp-content/uploads/2020/08/17-08-2020-12.00.03.jpg",
    museumId: 3,
  },
  {
    name: "Kardofoni",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Lute_Instrument.JPG/330px-Lute_Instrument.JPG",
    museumId: 4,
  },
];
const dropMuseumsTable = db.prepare(`
 DROP TABLE IF EXISTS museums;
 `);
dropMuseumsTable.run();

const createMuseumsTable = db.prepare(`
CREATE TABLE IF NOT EXISTS museums (
    id INTEGER,
    name TEXT NOT NULL,
    city TEXT,
    PRIMARY KEY (id)
);
`);
createMuseumsTable.run();

const createMuseum = db.prepare(`
INSERT INTO museums (name, city) VALUES (@name, @city)
`);

for (let museum of museums) {
  createMuseum.run(museum);
}

const dropWorksTable = db.prepare(`
DROP TABLE IF EXISTS works
`);
dropWorksTable.run();

const createWorksTable = db.prepare(`
CREATE TABLE IF NOT EXISTS works (
    id INTEGER,
    name TEXT NOT NULL,
    image TEXT,
    museumId INTEGER NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (museumId) REFERENCES museums(id)
)
`);
createWorksTable.run();

const createWork = db.prepare(`
INSERT INTO works (name, image, museumId) VALUES (@name, @image, @museumId)
`);
for (let work of works) {
  createWork.run(work);
}
