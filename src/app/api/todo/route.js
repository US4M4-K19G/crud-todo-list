import { NextResponse } from 'next/server';

// POST request to create a new todo
export async function POST(request) {
  try {
    const { title, desc } = await request.json();

    if (!title || !desc) {
      return NextResponse.json({ error: "Title and description are required" }, { status: 400 });
    }

    // Retrieve existing todos from localStorage or initialize empty array
    const todos = JSON.parse(localStorage.getItem("todos") || "[]");

    // Create a new todo item with a generated ID
    const newTodo = {
      _id: Date.now().toString(),
      title,
      desc,
      completed: false,
    };

    // Add the new todo to the list
    todos.push(newTodo);

    // Save updated todos back to localStorage
    localStorage.setItem("todos", JSON.stringify(todos));

    return NextResponse.json({ message: "Todo created successfully", todo: newTodo }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create todo" }, { status: 500 });
  }
}

// GET request to fetch all todos
export async function GET() {
  try {
    const todos = JSON.parse(localStorage.getItem("todos") || "[]");

    if (todos.length === 0) {
      return NextResponse.json({ message: "No todos found" }, { status: 404 });
    }

    return NextResponse.json({ todos }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch todos" }, { status: 500 });
  }
}
