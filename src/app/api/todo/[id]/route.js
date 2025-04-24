import { NextResponse } from "next/server";
import DBCon from "../../../libs/db";
import Todomodel from "../../../../models/Todo";


export async function PUT(request,{params}) {
    try {
        const id= params.id
        const {title, desc}= await request.json()
        await DBCon
        const findtodo= await Todomodel.findById(id)
        if (!findtodo) {
            return NextResponse.json(
                {message: "Not Found Todo"},{ status: 404 }
            ); 
            
        }
        const updatetodo=await Todomodel.findByIdAndUpdate(id,{title,desc},{new:true})
         return NextResponse.json(
                        {message: "Update Todo Successfully",todo:updatetodo},
                        { status: 200 }
                    );    
        }
     catch (error) {
        console.log(error)
        return NextResponse.json(
            {message: "Internal Server Error",},
            { status: 500 }
        ); 
    }
}
export async function DELETE(request,{params}) {
    try {
        const id= params.id
        await DBCon
        const findtodo= await Todomodel.findById(id)
        if (!findtodo) {
            return NextResponse.json(
                {message: "Not Found Todo"},{ status: 404 }
            ); 
            
        }
        const deletetodo=await Todomodel.findByIdAndDelete(id)
         return NextResponse.json(
                        {message: "Delete Todo Successfully",todo:deletetodo},
                        { status: 200 }
                    );    
        }
     catch (error) {
        console.log(error)
        return NextResponse.json(
            {message: "Internal Server Error",},
            { status: 500 }
        ); 
    }
}