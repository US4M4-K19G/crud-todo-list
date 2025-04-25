import { NextResponse } from 'next/server';

// PUT request to update a todo
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const { title, desc, completed } = await request.json();

    if (!title || !desc) {
      return NextResponse.json({ error: "Title and description are required" }, { status: 400 });
    }

    const todos = JSON.parse(localStorage.getItem("todos") || "[]");

    const updatedTodos = todos.map(todo =>
      todo._id === id ? { ...todo, title, desc, completed } : todo
    );

    // Save the updated todos back to localStorage
    localStorage.setItem("todos", JSON.stringify(updatedTodos));

    return NextResponse.json({ message: "Todo updated successfully", todo: { _id: id, title, desc, completed } });
  } catch () {
    return NextResponse.json({ error: "Failed to update todo" }, { status: 500 });
  }
}

// DELETE request to delete a todo
export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    const todos = JSON.parse(localStorage.getItem("todos") || "[]");

    const updatedTodos = todos.filter(todo => todo._id !== id);

    // Save the updated todos back to localStorage
    localStorage.setItem("todos", JSON.stringify(updatedTodos));

    return NextResponse.json({ message: "Todo deleted successfully" });
  } catch () {
    return NextResponse.json({ error: "Failed to delete todo" }, { status: 500 });
  }
}
