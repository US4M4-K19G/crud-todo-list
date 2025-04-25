"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function AddPage() {
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const router = useRouter();

  const handleSubmit = () => {
    if (!title || !desc) {
      toast.error("Please fill in both fields.");
      return;
    }

    const newTodo = {
      _id: Date.now().toString(),
      title,
      desc,
      completed: false
    };

    // Get current todos from localStorage
    const currentTodos = JSON.parse(localStorage.getItem("todos") || "[]");

    // Add new todo to the list
    const updatedTodos = [...currentTodos, newTodo];
    localStorage.setItem("todos", JSON.stringify(updatedTodos));

    // Redirect back to the main page
    toast.success("Todo added successfully!");
    router.push('/');
  };

  return (
    <div className="flex justify-center items-center mt-20">
      <div className="w-96 bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Add New Todo</h2>
        <input
          type="text"
          className="border p-2 w-full mb-4"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          className="border p-2 w-full mb-4"
          placeholder="Description"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
        />
        <button
          className="w-full bg-blue-500 text-white p-2 rounded-lg"
          onClick={handleSubmit}
        >
          Add Todo
        </button>
      </div>
    </div>
  );
}
