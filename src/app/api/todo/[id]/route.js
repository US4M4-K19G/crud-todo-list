import { NextResponse } from 'next/server';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
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
  } catch (error) {
    return NextResponse.json({ error: "Failed to update todo" }, { status: 500 });
  }
}
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const todos = JSON.parse(localStorage.getItem("todos") || "[]");

    const updatedTodos = todos.filter(todo => todo._id !== id);

    // Save the updated todos back to localStorage
    localStorage.setItem("todos", JSON.stringify(updatedTodos));

    return NextResponse.json({ message: "Todo deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete todo" }, { status: 500 });
  }
}

