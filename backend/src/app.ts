import express from "express"

import { Router, Request, Response } from "express"

const app = express()

const route = Router()

app.use(express.json())

route.get("/", (req: Request, res: Response) => {
  res.json({ message: "test init" })
})

app.use(route)

app.listen(3000, () => console.log("server running on port 3000"))
