"use client";

import React, { useEffect, useState } from 'react';
import { FaPlus } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { useRouter } from 'next/navigation';
import Modal from '../Components/Modal';
import axios from 'axios';
import toast from 'react-hot-toast';

// Define the Todo interface
interface Todo {
  _id: string;
  title: string;
  desc: string;
  completed: boolean;
}

export default function Page() {
  // Use the Todo interface to type the state
  const [todo, setTodo] = useState<Todo[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [todoId, setTodoId] = useState<string>('');
  const [refresh, setRefresh] = useState(false);
  const [selectedTab, setSelectedTab] = useState('incomplete');
  const [isClient, setIsClient] = useState(false);

  const router = useRouter();

  // Check if we are running in the browser, and set state accordingly
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Fetch todos from API or localStorage when page loads or refresh occurs
  useEffect(() => {
    if (isClient) {
      const savedTodos = localStorage.getItem("todos");
      if (savedTodos) {
        setTodo(JSON.parse(savedTodos));
      } else {
        fetchTodosFromAPI();
      }
    }
  }, [refresh, isClient]);

  // Fetch todos from API
  const fetchTodosFromAPI = async () => {
    try {
      const response = await axios.get('/api/todo');
      if (response.status === 200) {
        setTodo(response.data.todo);
        if (isClient) {
          localStorage.setItem("todos", JSON.stringify(response.data.todo));
        }
      }
    } catch (error) {
      console.error("Error fetching todos:", error);
      toast.error("Failed to load todos");
    }
  };

  // Update localStorage whenever the todos array changes
  useEffect(() => {
    if (isClient) {
      localStorage.setItem("todos", JSON.stringify(todo));
    }
  }, [todo, isClient]);

  const handleDelete = (id: string) => {
    setTodoId(id);
    setShowModal(true);
  };

  const handleNavigate = () => {
    router.push('/addpage');
  };

  const handleUpdate = (id: string) => {
    router.push(`/edit/${id}`);
  };

  const handleSubmit = async () => {
    try {
      if (todoId) {
        const response = await axios.delete(`/api/todo/${todoId}`);
        if (response.status === 200) {
          toast.success(response.data.message);
          const updatedTodos = todo.filter(t => t._id !== todoId);
          setTodo(updatedTodos);
          if (isClient) {
            localStorage.setItem("todos", JSON.stringify(updatedTodos));
          }
          setShowModal(false);
          setRefresh(prev => !prev);  // Trigger re-fetch
        }
      }
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  const toggleComplete = async (item: Todo) => {
    try {
      const updatedTodo = { ...item, completed: !item.completed };
      const response = await axios.put(`/api/todo/${item._id}`, updatedTodo);
      if (response.status === 200) {
        toast.success("Task updated");
        const updatedTodos = todo.map(t => (t._id === item._id ? updatedTodo : t));
        setTodo(updatedTodos);
        if (isClient) {
          localStorage.setItem("todos", JSON.stringify(updatedTodos));
        }
      }
    } catch (error) {
      toast.error("Failed to update status");
      console.error(error);
    }
  };

  const filteredTodos = todo.filter(item =>
    selectedTab === 'complete' ? item.completed : !item.completed
  );

  return (
    <>
      <Modal
        isVisible={showModal}
        onClose={() => setShowModal(false)}
        handleDelete={handleSubmit}
      />

      <div className='flex justify-center items-center text-2xl sm:text-3xl md:text-4xl mt-5 font-bold text-center px-2'>
        <h1>First Task in ZIMO By Usama</h1>
      </div>

      <div className='flex justify-center items-center px-4'>
        <div className='flex flex-col gap-8 p-4 sm:p-6 md:p-8 rounded-lg shadow-xl bg-green-200 mt-10 w-full max-w-screen-sm md:max-w-screen-md lg:max-w-2xl'>
          <div className='flex flex-col sm:flex-row justify-between items-center w-full gap-4 sm:gap-0'>
            <h1 className='font-bold text-2xl sm:text-3xl'>TODO LIST</h1>
            <button
              className='flex items-center bg-black px-3 py-2 sm:px-4 sm:py-2 text-white rounded hover:bg-gray-800 transition'
              onClick={handleNavigate}
            >
              Add <FaPlus className='ml-2' />
            </button>
          </div>

          <div className="flex gap-4 justify-center flex-wrap">
            <button
              className={`px-4 py-2 rounded ${selectedTab === 'incomplete' ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}
              onClick={() => setSelectedTab('incomplete')}
            >
              Incomplete
            </button>
            <button
              className={`px-4 py-2 rounded ${selectedTab === 'complete' ? 'bg-green-500 text-white' : 'bg-gray-300'}`}
              onClick={() => setSelectedTab('complete')}
            >
              Complete
            </button>
          </div>

          <div className='text-start flex flex-col gap-5'>
            {filteredTodos.length === 0 && (
              <p className='text-center text-gray-500'>No {selectedTab} tasks found.</p>
            )}

            {filteredTodos.map((item) => (
              <div key={item._id} className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b-black-500 border-b-4 rounded-xl p-3 bg-white'>
                <div className='flex-1'>
                  <h5 className={`font-bold text-lg ${item.completed ? 'line-through text-gray-500' : ''}`}>
                    {item.title}
                  </h5>
                  <p className='text-sm text-gray-700'>{item.desc}</p>
                </div>
                <div className='flex items-center gap-3'>
                  <input
                    type="checkbox"
                    checked={item.completed}
                    onChange={() => toggleComplete(item)}
                    title="Mark as complete"
                  />
                  <MdDelete size={23} color='red' cursor='pointer' onClick={() => handleDelete(item._id)} />
                  <FaEdit size={20} cursor='pointer' onClick={() => handleUpdate(item._id)} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
