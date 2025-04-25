import { NextResponse } from 'next/server';

// GET request to fetch all todos
export async function GET() {
  try {
    const todos = JSON.parse(localStorage.getItem("todos") || "[]");
    return NextResponse.json({ todo: todos });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch todos" }, { status: 500 });
  }
}

// POST request to create a new todo
export async function POST(request: Request) {
  try {
    const { title, desc } = await request.json();

    if (!title || !desc) {
      return NextResponse.json({ error: "Title and description are required" }, { status: 400 });
    }

    const newTodo = {
      _id: Date.now().toString(),
      title,
      desc,
      completed: false,
    };

    // Get current todos from localStorage
    const currentTodos = JSON.parse(localStorage.getItem("todos") || "[]");

    // Add new todo to the list
    const updatedTodos = [...currentTodos, newTodo];
    localStorage.setItem("todos", JSON.stringify(updatedTodos));

    return NextResponse.json({ message: "Todo added successfully", todo: newTodo });
  } catch (error) {
    return NextResponse.json({ error: "Failed to add todo" }, { status: 500 });
  }
}
