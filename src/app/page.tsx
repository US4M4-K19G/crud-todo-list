"use client"

import React, { useEffect, useState } from 'react'
import { FaPlus } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { useRouter } from 'next/navigation';
import Modal from '../components/Modal.jsx';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function Page() {
  const [todo, setTodo] = useState([]);
  const [showmodal, setShowmodal] = useState(false);
  const [todoid, settodoid] = useState('');
  const [refresh, setResfresh] = useState(false);
  const [selectedTab, setSelectedTab] = useState('incomplete');

  const router = useRouter();

  useEffect(() => {
    const localData = localStorage.getItem("todos");
    if (localData) {
      setTodo(JSON.parse(localData));
    } else {
      fetchTodosFromAPI();
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todo));
  }, [todo]);

  const fetchTodosFromAPI = async () => {
    try {
      const request = await axios.get('/api/todo');
      const response = request.data;
      setTodo(response.todo);
      localStorage.setItem("todos", JSON.stringify(response.todo)); 
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = (id: any) => {
    settodoid(id);
    setShowmodal(true);
  };

  const handleNavigate = () => {
    router.push('/addpage');
  };

  const handleUpdate = (id: any) => {
    router.push(`edit/${id}`);
  };

  const handelSubmit = async () => {
    try {
      if (todoid) {
        const request = await axios.delete(`/api/todo/${todoid}`);
        const response = request.data;
        if (request.status === 200) {
          toast.success(response.message);
          setTodo(prev => prev.filter(t => t._id !== todoid));
          setShowmodal(false);
          setResfresh(true);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const filteredTodos = todo.filter(eleme =>
    selectedTab === 'complete' ? eleme.completed : !eleme.completed
  );

  return (
    <>
      <Modal isVisible={showmodal} onClose={() => setShowmodal(false)} handleDelete={handelSubmit} />
      <div className='flex justify-center items-center text-4xl mt-5 font-bold'>
        <h1>Frist Task in ZIMO By Usama</h1>
      </div>
      <div className='flex justify-center items-center'>
        <div className='flex flex-col gap-10 p-8 rounded-lg shadow-xl bg-green-200 mt-10 w-2/4'>
          <div className='flex justify-between items-center w-full'>
            <h1 className='font-bold text-3xl'>TODO LIST</h1>
            <button className='flex items-center bg-black px-4 py-2 text-white' onClick={handleNavigate}>
              Add <FaPlus className='ml-2' />
            </button>
          </div>

          <div className="flex gap-4 justify-center">
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

            {filteredTodos.map((eleme) => {
              const toggleComplete = async () => {
                try {
                  const updatedTodo = {
                    title: eleme.title,
                    desc: eleme.desc,
                    completed: !eleme.completed
                  };

                  const response = await axios.put(`/api/todo/${eleme._id}`, updatedTodo);
                  if (response.status === 200) {
                    toast.success('Task status updated');

                    setTodo(prev =>
                      prev.map(t =>
                        t._id === eleme._id ? { ...t, completed: !t.completed } : t
                      )
                    );
                  }
                } catch (error) {
                  toast.error('Failed to update status');
                  console.error(error);
                }
              };

              return (
                <div key={eleme._id} className='flex justify-between items-center w-full border-b-customPurple border-b-4 rounded-xl p-2 bg-white'>
                  <div className='w-60 flex flex-col gap-1'>
                    <h5 className={`font-bold text-1xl ${eleme.completed ? 'line-through text-gray-500' : ''}`}>
                      {eleme.title}
                    </h5>
                    <p className='text-sm'>{eleme.desc}</p>
                  </div>
                  <div className='flex items-center gap-4'>
                    <input
                      type="checkbox"
                      checked={eleme.completed}
                      onChange={toggleComplete}
                      title="Mark as complete"
                    />
                    <MdDelete size={23} color='red' cursor='pointer' onClick={() => handleDelete(eleme._id)} />
                    <FaEdit size={20} cursor='pointer' onClick={() => handleUpdate(eleme._id)} />
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
