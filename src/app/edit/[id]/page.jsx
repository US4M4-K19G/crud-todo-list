'use client'
import React, { useState, useEffect } from "react";
import axios from 'axios';
import { useRouter, useParams } from 'next/navigation';
import toast from 'react-hot-toast';

export default function EditTodoPage() {
  const [todo, setTodo] = useState({});
  const { id } = useParams();
  const router = useRouter();

  useEffect(() => {
    const fetchTodo = async () => {
      try {
        const response = await axios.get(`/api/todo/${id}`);
        if (response.status === 200) {
          setTodo(response.data.todo);
        }
      } catch (error) {
        toast.error("Error fetching Todo");
      }
    };

    fetchTodo();
  }, [id]);

  const handleChange = (e) => {
    setTodo({
      ...todo,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.put(`/api/todo/${id}`, todo);
      if (response.status === 200) {
        toast.success("Todo Updated");

        // Update the localStorage todos list
        const todos = JSON.parse(localStorage.getItem("todos"));
        const updatedTodos = todos.map(t => t._id === id ? response.data.todo : t);
        localStorage.setItem("todos", JSON.stringify(updatedTodos));

        router.push('/');
      }
    } catch (error) {
      toast.error("Error updating Todo");
    }
  };

  return (
    <div className="flex justify-center h-screen">
      <div className="mt-8 flex gap-8 flex-col p-10 rounded-lg h-80 shadow-lg bg-black">
        <h1 className="text-white font-bold text-2xl">Edit Todo</h1>
        <label className="relative block">
          <input
            name="title"
            className="placeholder:italic placeholder:text-slate-400 block bg-white w-full border border-slate-300 rounded-md py-2 pl-9 pr-3 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm"
            type="text"
            value={todo.title || ""}
            onChange={handleChange}
          />
        </label>
        <label className="relative block">
          <input
            name="desc"
            className="placeholder:italic placeholder:text-slate-400 block bg-white w-full border border-slate-300 rounded-md py-2 pl-9 pr-3 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm"
            type="text"
            value={todo.desc || ""}
            onChange={handleChange}
          />
        </label>

        <button
          className="rounded-lg bg-green-500 px-4 py-2 text-white font-bold"
          onClick={handleSubmit}
        >
          Update
        </button>
      </div>
    </div>
  );
}
