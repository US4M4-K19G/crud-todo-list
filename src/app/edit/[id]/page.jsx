"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import toast from 'react-hot-toast';

export default function EditPage() {
  const { id } = useParams();
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');

  useEffect(() => {
    const todos = JSON.parse(localStorage.getItem("todos") || "[]");
    const todo = todos.find(todo => todo._id === id);
    if (todo) {
      setTitle(todo.title);
      setDesc(todo.desc);
    }
  }, [id]);

  const handleSubmit = () => {
    const todos = JSON.parse(localStorage.getItem("todos") || "[]");
    const updatedTodos = todos.map(todo =>
      todo._id === id ? { ...todo, title, desc } : todo
    );
    localStorage.setItem("todos", JSON.stringify(updatedTodos));
    toast.success("Todo updated successfully!");
    router.push('/');
  };

  return (
    <div className="flex justify-center items-center mt-20">
      <div className="w-96 bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Edit Todo</h2>
        <input
          type="text"
          className="border p-2 w-full mb-4"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          className="border p-2 w-full mb-4"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
        />
        <button
          className="w-full bg-blue-500 text-white p-2 rounded-lg"
          onClick={handleSubmit}
        >
          Update Todo
        </button>
      </div>
    </div>
  );
}
