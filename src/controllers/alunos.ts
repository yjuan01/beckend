import { Request, Response } from "express"

import { prisma } from "../../config/prisma";
import { Prisma } from "../../generated/prisma/client";

const prismaErrorCodes: Record<string, number> = {
    P2002: 409, 
    P2025: 404, 
};

 export default {
    list: async (request: Request, response: Response) => {
        try{
        const users = await prisma.alunos.findMany({
            include: {cursos:true}
        });
        return response.status(200).json(users);
       }catch(e) {
            if (e instanceof Prisma.PrismaClientKnownRequestError){

            return response.status(prismaErrorCodes[e.code] || 500).json(e.message)
        }
        return response.status(500).json("Unknown error. Try again later")
        }
    },

    create: async (request: Request, response: Response) => {
        try{                                            // @ts-ignore
        const { name, cpf, email, idade } = request.body;

      
        if (!name || !cpf || !email || !idade) {
            return response.status(400).json("Dados do aluno incompletos");
        }
    const user = await prisma.alunos.create({
        data: {
            name,
            email,
            idade,
            cpf
        },
    });
    return response.status(201).json(user);

    }catch(e){
      console.error(e)
            if (e instanceof Prisma.PrismaClientKnownRequestError){
            return response.status(prismaErrorCodes[e.code] || 500).json(e.message)
        }
        return response.status(500).json("Unknown error. Try again later")
        }
},
    getByid: async (request: Request, response: Response) => {
        try {
        const { id } = request.params;
        const user = await prisma.alunos.findUnique({
            where: {
            id: +id,
            },
        });
        return response.status(200).json(user);

        } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
            return response.status(prismaErrorCodes[e.code] || 500).json(e.message);
        }
        return response.status(500).json("Unkown error. Try again later");
        }
    },
    update: async (request: Request, response: Response) =>{
        try {
            const { id } = request.params;              // @ts-ignore
            const { name, cpf, email, idade } = request.body;
            const user = await prisma.alunos.update({
        data: {
            name,
            email,
            idade,
            cpf
        },
        where: { id: +id}
    });
    return response.status(200).json(user);
    }catch(e){
            if (e instanceof Prisma.PrismaClientKnownRequestError){

            return response.status(prismaErrorCodes[e.code] || 500).json(e.message)
        }
        return response.status(500).json("Unknown error. Try again later")
        }
    },
     delete: async(request: Request, response: Response) => {
        try{
            const {id} = request.params

            const user = await prisma.alunos.delete({where:{ id: +id}})

            return response.status(200).json(user)
        }catch(e){
            if (e instanceof Prisma.PrismaClientKnownRequestError){
            return response.status(prismaErrorCodes[e.code] || 500).json(e.message)
        }
        return response.status(500).json("Unknown error. Try again later")
        }
    },
    matricular: async (request: Request, response: Response) => {
  try {
    const { id } = request.params; // @ts-ignore
    const { cursosIds } = request.body;

    const user = await prisma.alunos.update({
      where: { id: Number(id) },
      data: {
        // @ts-ignore
        cursos: {
          connect: cursosIds.map((cursoId: number) => ({ id: cursoId })),
        }
      },
      include: {
        cursos: true
      }
    });

    return response.status(201).json(user);

  } catch (e: any) {
    console.error(e);

    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      return response.status(prismaErrorCodes[e.code] || 500).json(e.message);
    }

    return response.status(500).json("Unknown error. Try again later");
  }
},
    desmatricular: async (request: Request, response: Response) => {
  try {
    const { id } = request.params; 
    // @ts-ignore
    const { cursosIds } = request.body

    const user = await prisma.alunos.update({
      where: { id: +id },
      data: {
        cursos: {
          disconnect: cursosIds.map((cursoId: number) => ({ id: cursoId })),
        }
      },
      select: { cursos: true }
    });

    return response.status(200).json(user);

  } catch (e: any) {
    console.error(e);
    return response.status(500).json("Unknown error. Try again later");
  }
},
}