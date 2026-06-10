import "dotenv/config";
import express, { json, request, response } from "express";
import morgan from "morgan";
import cors from "cors";
import People from "./models/people.js";

const app = express();
app.use(express.static("dist"));
app.use(cors());
app.use(express.json());
app.use(morgan("tiny"));

app.get("/", (request, response) => {
  response.send("<h1>This server is serving a Phonebook</h1>");
});

app.get("/api/persons", (request, response) => {
  fetchPeople().then((people) => {
    if (people.length < 1) {
      makeFirstPerson();
      fetchPeople().then((people) => {
        response.json(people);
      });
    } else {
      fetchPeople().then((people) => {
        response.json(people);
      });
    }
  });
});

app.get("/info", (request, response) => {
  response.send(`
    <p>Phonebook has info for ${numbersList.length} entries </p>
    <p>${new Date(Date.now()).toString()}</p>
    `);
});

app.get("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  const requestedPerson = numbersList.find((person) => person.id === id);

  if (requestedPerson) {
    response.json(requestedPerson);
  } else {
    response.status(404).json({ error: "Person not found!" });
  }
});

app.delete("/api/persons/:id", (request, response, next) => {
  const id = request.params.id;
  People.findByIdAndDelete(id)
    .then((deletedPeople) => {
      console.log(deletedPeople);
      if (deletedPeople) {
        response.json(deletedPeople);
      } else {
        throw new Error("Person doesn't exit!");
      }
    })
    .catch((error) => next(error));
});

app.post("/api/persons/", (request, response) => {
  const requestedPerson = request.body;
  if (requestedPerson.name && requestedPerson.number) {
    savePeople(requestedPerson).then((savedPeople) =>
      response.json(savedPeople),
    );
  } else {
    response.status(400).json({ error: "Bad data" });
  }
});

app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => console.log("Server has started on PORT: ", PORT));

const generateId = () => Math.floor(Math.random() * 100000);

const makeFirstPerson = () => {
  const number = new People({
    name: "Fang Yuan",
    number: "1234567890",
  });
  number.save();
};

async function fetchPeople() {
  const allPeople = await People.find({});
  return allPeople;
}

function savePeople(people) {
  const peopleDocument = new People({
    name: people.name,
    number: people.number,
  });
  return peopleDocument.save();
}

function errorHandler(error, req, res, next) {
  console.log(error.message);
  if (error.message == "Person doesn't exit!") {
    res.status(404).json({ error: "Person doesn't exit!" });
  }
  next(error);
}
