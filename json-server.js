const jsonServer = require("json-server")
const server = jsonServer.create()
const router = jsonServer.router("db.json")
const middlewares = jsonServer.defaults()

server.use(middlewares)

server.use((req, res, next) => {
  setTimeout(next, 500)
})

server.use(router)

const port = 3000
server.listen(port, () => {
  console.log(`JSON Server is running on port ${port}`)
  console.log(`Server is available at http://localhost:${port}`)
})