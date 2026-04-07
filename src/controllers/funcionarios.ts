import e, { Request, Response } from "express"
import bcrypt from "bcrypt";
import { prisma } from "../../config/prisma";
import { Prisma } from "../../generated/prisma/client";
import { handleErrors } from "../helpers/handleErrors.js"; 
import jwt from "jsonwebtoken";


 export default {
    login : async (request: Request, response: Response) => {
        try {
            const { email, senha } = request.body;

            const employee = await prisma.funcionarios.findUnique({
                where: { 
                    email,
                 },
            });

            if (!employee || !bcrypt.compareSync(senha, employee.senha)) {
                return response.status(404).json("Invalid email or password");
            }



            const token = jwt.sign(employee, process.env.JWT_SECRET!, {
                expiresIn: "1d",
            });

            return response.status(200).json({ access_token: token });
        } catch(e) {
            return handleErrors(e, response)
    }
},
    list: async (request: Request, response: Response) => {
        try{
        const employee = await prisma.funcionarios.findMany();
        return response.status(200).json(employee);
       }catch(e) {
            return handleErrors(e, response)
        }
    },

     update: async (request: Request, response: Response) =>{
            try {
                const { id } = request.params;              // @ts-ignore
                const { name, email, admin, user} = 
                request.body;
            
            if (!user.admin && user.id !== +id) {
                return response.status(403).json
                ("Não autorizado");
            }

            const employee = await prisma.
            funcionarios.update({
            data: {
                name,
                email,
                admin: user.admin ? admin : false,
            },
            where: { id: +id}
        });
    

        return response.status(200).json(employee);
        }catch(e){
               return handleErrors(e, response)
            }
        },

        delete: async(request: Request, response: Response) => {
                try{
                    const { id } = request.params;
                    const { user } = request.body; 
                    
                if (!user.admin) {
                    return response.status(403).json("Não autorizado");
                }
        
                    return response.status(200).json(user)
                }catch(e){
                    return handleErrors(e, response)
                }
            },

    create: async (request: Request, response: Response) => {
        try{                                            // @ts-ignore
        const { name, senha, admin, email, user } = request.body;

        if (!user.admin) {
            return response.status(403).json("Não autorizado");
        }

        if (!name || !senha || !email) {
            return response.status(400).json("Dados incompletos");
        }
      

    const employee = await prisma.funcionarios.create({
        data: {
            name,
            email,
            senha: bcrypt.hashSync(senha, +process.env.BCRYPT_ROUNDS!),
            admin,
        },
    });
    return response.status(201).json(employee);
    }catch(e){
      return handleErrors(e, response)
        }
},
    getByid: async (request: Request, response: Response) => {
        try {
        const { id } = request.params;
        const employee = await prisma.funcionarios.findUnique({
            where: {
            id: +id,
            },
        });
        return response.status(200).json(employee);
        }catch(e) {
            return handleErrors(e, response)
        }
    },
}