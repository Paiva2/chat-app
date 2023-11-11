import { app } from "./app"

const server = app.listen(process.env.PORT, () => {
  return console.log(`Server running at: ${process.env.PORT}`)
})

export default server
