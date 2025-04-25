"use client";

import React, { useEffect, useState } from 'react';
import { FaPlus } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { useRouter } from 'next/navigation';
import Modal from '../Components/Modal';
import toast from 'react-hot-toast';
import axios from 'axios';

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

  const router = useRouter();

  // Fetch todos from API whenever `refresh` changes or on initial load
  useEffect(() => {
    fetchTodosFromAPI();
  }, [refresh]);

  const fetchTodosFromAPI = async () => {
    try {
      const response = await axios.get('/api/todo');
      setTodo(response.data.todo);
    } catch (error) {
      console.error("Error fetching todos:", error);
      toast.error("Failed to load todos");
    }
  };

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
      const response = await axios.delete(`/api/todo/${todoId}`);
      if (response.status === 200) {
        toast.success(response.data.message);
        setTodo(prev => prev.filter(t => t._id !== todoId));
        setShowModal(false);
        setRefresh(prev => !prev);
      }
    } catch () {
      toast.error("Failed to delete todo");
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

            {filteredTodos.map((item) => {
              const toggleComplete = async () => {
                try {
                  const updatedTodo = {
                    title: item.title,
                    desc: item.desc,
                    completed: !item.completed
                  };

                  const response = await axios.put(`/api/todo/${item._id}`, updatedTodo);
                  if (response.status === 200) {
                    toast.success("Task updated");
                    setTodo(prev =>
                      prev.map(t =>
                        t._id === item._id ? { ...t, completed: !t.completed } : t
                      )
                    );
                  }
                } catch (error) {
                  toast.error("Failed to update status");
                  console.error(error);
                }
              };

              return (
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
                      onChange={toggleComplete}
                      title="Mark as complete"
                    />
                    <MdDelete size={23} color='red' cursor='pointer' onClick={() => handleDelete(item._id)} />
                    <FaEdit size={20} cursor='pointer' onClick={() => handleUpdate(item._id)} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
