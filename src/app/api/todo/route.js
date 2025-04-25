import { NextResponse } from "next/server";
import DBCon from "../../libs/db";
import Todomodel from "../../../models/Todo";

export async function POST(request) {
    try {
        const { title, desc } = await request.json();
        await DBCon();

        if (!title || !desc) {
            return NextResponse.json(
                {
                    success: true,
                    message: "All fields are Required",
                },
                { status: 303 }
            );
        }

        const createdTodo = await Todomodel.create({ title, desc });

        return NextResponse.json(
            {
                success: true,
                message: "TODO Created Successfully",
                todo: createdTodo,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error in POST /todo:", error);
        return NextResponse.json(
            {
                success: false,
                message: "Internal Server Error",
            },
            { status: 500 }
        );
    }
}

export async function GET() { 
    try {
        await DBCon();

        const Todo = await Todomodel.find();
        if (!Todo || Todo.length === 0) {
            return NextResponse.json(
                {
                    success: false,
                    message: "No Data Found",
                },
                { status: 404 }
            );
        }

        return NextResponse.json(
            {
                success: true,
                message: "TODO Created Successfully",
                todo: Todo,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error in GET /todo:", error); 
        return NextResponse.json(
            {
                success: false,
                message: "Internal Server Error",
            },
            { status: 500 }
        );
    }
}
