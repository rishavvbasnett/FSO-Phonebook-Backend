import express, { json, request, response } from "express";
import morgan from "morgan";
import cors from "cors";

let numbersList = [
  {
    id: "1",
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: "2",
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: "3",
    name: "Dan Abramov",
    number: "12-43-234345",
  },
];

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan("tiny"));

app.get("/", (request, response) => {
  response.send("<h1>This server is serving a Phonebook</h1>");
});

app.get("/api/persons", (request, response) => {
  response.json(numbersList);
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

app.delete("/api/persons/:id", (request, response) => {
  const id = request.params.id;

  const requestedPerson = numbersList.find((person) => person.id === id);

  if (requestedPerson) {
    numbersList = numbersList.filter((person) => person.id !== id);
    response.send(`<p>${requestedPerson.name} successfully deleted!</p>`);
  } else {
    response.status(404).json({ error: "Person not found!" });
  }
});

app.post("/api/persons/", (request, response) => {
  const requestedPerson = request.body;

  if (!requestedPerson.name || !requestedPerson.number) {
    response.status(400).json({ error: "Name or Number is missing!" });
  } else if (
    numbersList.find((person) => person.name === requestedPerson.name)
  ) {
    response.status(400).json({ error: "Name already exists!" });
  } else if (
    numbersList.find((person) => person.number === requestedPerson.number)
  ) {
    response.status(400).json({ error: "Number already exists!" });
  } else {
    requestedPerson.id = generateId();
    response.json(requestedPerson);
  }
});

const PORT = process.env.PORT;
app.listen(PORT, () => console.log("Server has started on PORT: ", PORT));

const generateId = () => Math.floor(Math.random() * 100000);
