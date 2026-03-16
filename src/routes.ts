import { Router } from "express";

import alunosController from "./controllers/alunos";

const routes = Router();

routes.get("/", (request, response) =>
    response.status(200).json({ success: true })
);


// Rotas de alunos
// routes.get("/alunos", (request, response) =>

routes.get("/alunos", (request, response) => 
    alunosController.list(request, response),
);
routes.get("/alunos/:id", alunosController.getById);
routes.post("/alunos", alunosController.create);


routes.put("/alunos", (request, response) => {
    return response.status(200).json({ success: true });
});


export default routes;