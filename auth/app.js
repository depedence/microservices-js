const express = require('express');
const app = express();

app.use(express.json());

const VALID_TOKEN = 'mysecrettoken';
let notes = [];
let idCounter = 1;

// Простейшая "авторизация"
function authMiddleware(req, res, next) {
  const token = req.headers.authorization;

  if (token !== `Bearer ${VALID_TOKEN}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  next();
}

// Маршрут входа: возвращает токен, если передан верный пароль
app.post('/login', (req, res) => {
  const { password } = req.body;

  if (password === 'qwerty') {
    res.json({ token: VALID_TOKEN });
  } else {
    res.status(403).json({ error: 'Invalid password' });
  }
});

// Защищённый маршрут: получить все заметки
app.get('/notes', authMiddleware, (req, res) => {
  res.json(notes);
});

// Защищённый маршрут: создать заметку
app.post('/notes', authMiddleware, (req, res) => {
  const { title, content } = req.body;

  if (!title || !content) {
    return res.status(400).json({ error: 'Title and content are required' });
  }

  const newNote = {
    id: idCounter++,
    title,
    content
  };

  notes.push(newNote);
  res.status(201).json(newNote);
});

// Защищённый маршрут: получить заметку по id
app.get('/notes/:id', authMiddleware, (req, res) => {
  const noteId = Number(req.params.id);
  const note = notes.find(n => n.id === noteId);

  if (!note) {
    return res.status(404).json({ error: 'Note not found' });
  }

  res.json(note);
});

module.exports = app;
