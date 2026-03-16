import { Request, Response } from "express";
import { prisma } from "../../config/prisma"

export default {

    list: async (request: Request, response: Response) => {
        const users = await prisma.alunos.findMany();
        return response.status(200).json(users);
    },

    create: async (request: Request, response: Response) => {
        const { name, idade, cpf, email } = request.body;
        const user = await prisma.alunos.create({
            data: {
                name,
                idade,
                cpf,
                email
            }
        });





        return response.status(201).json(user);


    },

    update: async (request: Request, response: Response) => { // atualizar
        const { id, name, idade, cpf, email } = request.body;
        const user = await prisma.alunos.update({
            where: { id },
            data: {
                name,
                idade,
                cpf,
                email
            }
        });
    },

    getById: async (request: Request, response: Response) => {
        const { id } = request.params;
        const user = await prisma.alunos.findUnique({
            where: {
                id: +id
            }
        });
        return response.status(200).json(user)
    },

update: async (request: Request, response: Response) => {
    const { id } = request.params;
    const { name, idade, cpf, email } = request.body;

    const user = await prima.alunos.update({
        date: {
            name,
            idade,
            cpf,
            email
        },
        where: { id: +id }
    });

    return response.status(200).json(user);
};