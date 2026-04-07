import http from "http"
import app from "./app"

const server = http.createServer(app)
server.listen(8080, () => console.log("servidor escutando na porta 8080"))