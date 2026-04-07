import type { Request, Response } from "express";
import { prisma } from "../../config/prisma.js";
import prismaErrorCodes from "../../config/prismaErroCodes.json";
import { Prisma } from "../../generated/prisma/client.js";
import { handleErrors } from "../helpers/handleErrors.js";



export default {
    list: async (request: Request, response: Response) => {
        try{
            const users = await prisma.cursos.findMany()
            return response.status(200).json(users)
        }catch(e){
            return handleErrors(e, response)
        }
    },
  create: async(request: Request, response: Response) => {
        try{                                                           // @ts-ignore
            const {nome, professor, cargaHoraria, descricao} = request.body;

            if (!nome || !cargaHoraria || !descricao) {
                return response.status(400).json("Dados do curso incompletos");
            }
            const user =await prisma.cursos.create({
                data:{
                    nome,
                    professor,
                    cargaHoraria,
                    descricao
                },
            })
            return response.status(200).json(user)
        }catch(e: any){
            return handleErrors(e, response)
        }
    },
getByid: async (request: Request, response: Response) => {
    try {
      const { id } = request.params;
      const user = await prisma.cursos.findUnique({
        where: {
          id: +id,
        },
      });
      return response.status(200).json(user);
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        // @ts-ignore
        return response.status(prismaErrorCodes[e.code] || 500).json(e.message);
      }
      return response.status(500).json("Unkown error. Try again later");
    }
  },
  update: async (request: Request, response: Response) => {
    try {
        const { id } = request.params;              // @ts-ignore
        const { name, cpf, email, idade } = request.body;

        const user = await prisma.alunos.update({
            where: { id: +id },
            data: { name, email, idade, cpf }
        });

        return response.status(200).json(user);
    } catch (e) {
        return handleErrors(e, response);
    }
},
  delete: async(request: Request, response: Response) => {
        try{
            const {id} = request.params

            const user = await prisma.cursos.delete({where:{ id: +id}})

            return response.status(200).json(user)
        }catch(e){
            return handleErrors(e, response)
        }
    }
};