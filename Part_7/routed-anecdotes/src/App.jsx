/* eslint-disable react/prop-types */
import { useState } from "react";
import Menu from "./components/Menu";
import AnecdoteList from "./components/AnecdoteList";
import Anecdote from "./components/Anecdote";
import About from "./components/About";
import Footer from "./components/Footer";
import CreateNew from "./components/CreateNew";
import { Routes, Route, useMatch } from "react-router-dom";

const App = () => {
  const [anecdotes, setAnecdotes] = useState([
    {
      content: "If it hurts, do it more often",
      author: "Jez Humble",
      info: "https://martinfowler.com/bliki/FrequencyReducesDifficulty.html",
      votes: 0,
      id: 1,
    },
    {
      content: "Premature optimization is the root of all evil",
      author: "Donald Knuth",
      info: "http://wiki.c2.com/?PrematureOptimization",
      votes: 0,
      id: 2,
    },
  ]);

  const [notification, setNotification] = useState("");

  const broadcastMessage = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(""), 5000);
  };

  const addNew = (anecdote) => {
    anecdote.id = Math.round(Math.random() * 10000);
    setAnecdotes(anecdotes.concat(anecdote));
  };

  const anecdoteById = (id) => anecdotes.find((a) => a.id === id);

  const vote = (id) => {
    const anecdote = anecdoteById(id);

    const voted = {
      ...anecdote,
      votes: anecdote.votes + 1,
    };

    setAnecdotes(anecdotes.map((a) => (a.id === id ? voted : a)));
  };

  const anecdoteMatch = useMatch("/anecdotes/:id");
  const anecdote = anecdoteMatch
    ? anecdotes.find(
        (anecdote) => anecdote.id === Number(anecdoteMatch.params.id)
      )
    : null;

  return (
    <div>
      <h1>Software anecdotes</h1>
      <Menu />
      <li>{notification}</li>

      <Routes>
        <Route
          path="/anecdotes/:id"
          element={<Anecdote anecdote={anecdote} handleVote={vote} />}
        />
        <Route
          path="/anecdotes"
          element={<AnecdoteList anecdotes={anecdotes} />}
        />
        <Route
          path="/create"
          element={
            <CreateNew addNew={addNew} broadcastMessage={broadcastMessage} />
          }
        />
        <Route path="/about" element={<About />} />
      </Routes>

      <Footer />
    </div>
  );
};

export default App;
