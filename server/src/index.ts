import express from "express"
import cors from "cors"
import { getDatabaseConnection } from "./database"

const PORT = process.env.PORT ?? 3000
const app = express()
const debug = true
const debugTime = 2

// MIDDLEWARES
app.use(cors({
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
}));
app.use(express.json())
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:5173');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// ROTA PRINCIPAL
app.get("/", (req, res) => res.send("Hello World!"))

// BUSCAR TODAS OS DADOS
app.get("/item", async (req, res) => {
  const db = await getDatabaseConnection()
  const resp = await db.all("SELECT * FROM todo ORDER BY id DESC")
  debug
    ? setTimeout(() => { res.json(resp) }, 1000 * debugTime)
    : res.json(resp)
})

// BUSCAR DADOS POR ID
app.get("/item/:id", async (req, res) => {
  const { id } = req.params
  const db = await getDatabaseConnection()
  const resp = await db.all("SELECT * FROM todo WHERE id=?", id)
  debug
    ? setTimeout(() => { res.json(resp) }, 1000 * debugTime)
    : res.json(resp)
})

// CRIAR DADOS
app.post("/item", async (req, res) => {
  const { todo, date_init, date_end } = req.body;
  const db = await getDatabaseConnection()
  const resp = await db.run("INSERT INTO todo (text, date, date_init, date_end) VALUES (?, ?, ?, ?)", todo, Date.now(), date_init, date_end);
  debug
    ? setTimeout(() => { res.json(resp) }, 1000 * debugTime)
    : res.json(resp)
})

// ATUALIZAR DADOS
app.put("/item/:id", async (req, res) => {
  const { todo, date_init, date_end } = req.body;
  const { id } = req.params;

  const db = await getDatabaseConnection()
  const resp = await db.run("UPDATE todo SET text = ?, date_init = ?, date_end = ? WHERE id = ?", todo, date_init, date_end, id);
  
  debug
    ? setTimeout(() => { res.json(resp) }, 1000 * debugTime)
    : res.json(resp)
})

// ATUALIZAR DADOS (coluna)
app.patch("/item/:id", async (req, res) => {
  const { id } = req.params
  const keys = Object.keys(req.body)
  const values = Object.values(req.body)
  const permitedColumns = ["text", "date", "date_init", "date_end"]
  const isValidOperation = keys.every(c => permitedColumns.includes(c))
  if (!isValidOperation)
    return res
      .status(400)
      .json({ error: `Invalid Column, permited '${permitedColumns.join(', ')}', received '${keys.join(', ')}'` })
  const sql = `UPDATE todo SET ${keys.map(c => `${c}=?`).join(", ")} WHERE id=?`
  const db = await getDatabaseConnection()
  const resp = await db.run(sql, ...values, id)
  debug
    ? setTimeout(() => { res.json(resp) }, 1000 * debugTime)
    : res.json(resp)
})

// DELETAR DADOS
app.delete("/item/:id", async (req, res) => {
  const { id } = req.params
  const db = await getDatabaseConnection()
  const resp = await db.run("DELETE FROM todo WHERE id = ?", id)
  debug
    ? setTimeout(() => { res.json(resp) }, 1000 * debugTime)
    : res.json(resp)
})

// ⚡🔥☄️🌑🌚🌞☀️⭐💧
app.listen(PORT, () => console.log(`⚡ Server listening on port ${PORT}`))