import { Router } from "express";

import alunosController from "./controllers/alunos";
import cursosController from "./controllers/cursos";
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

// Rotas de alunos
// routes.get("/alunos", (request, response) =>

routes.get("/alunos", alunosController.list);
routes.get("/alunos/:id", alunosController.getById);
routes.post("/alunos", alunosController.create);
routes.put("/alunos/:id", alunosController.update);
routes.delete("/alunos/:id", alunosController.delete);

routes.get("/cursos", cursosController.list);
routes.get("/cursos/:id", cursosController.getById);
routes.post("/cursos", cursosController.create);
routes.put("/cursos/:id", cursosController.update);
routes.delete("/cursos/:id", cursosController.delete);


export default routes;