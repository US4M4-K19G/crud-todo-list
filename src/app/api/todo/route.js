import { NextResponse } from 'next/server';

let todos = []; // TEMP in-memory store (resets on server restart)

// POST request to create a new todo
export async function POST(request) {
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

    todos.push(newTodo);

    return NextResponse.json({ message: "Todo created successfully", todo: newTodo }, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Failed to create todo" }, { status: 500 });
  }
}

// GET request to fetch all todos
export async function GET() {
  try {
    if (todos.length === 0) {
      return NextResponse.json({ message: "No todos found" }, { status: 404 });
    }

    return NextResponse.json({ todos }, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Failed to fetch todos" }, { status: 500 });
  }
}
