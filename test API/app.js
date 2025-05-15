// notesApp.js
const express = require('express');
const app = express();

app.use(express.json());

// Хранилище заметок (в оперативной памяти)
const notes = [];

// POST /notes — добавление заметки
app.post('/notes', (req, res) => {
  const { title, content } = req.body;

  // Проверка, что поля заполнены
  if (!title || !content) {
    return res.status(400).json({ error: 'Missing title or content' });
  }

  const newNote = {
    id: notes.length + 1,
    title,
    content,
  };

  notes.push(newNote);
  res.status(201).json(newNote);
});

// GET /notes — получить все заметки
app.get('/notes', (req, res) => {
  res.json(notes);
});

module.exports = app;
