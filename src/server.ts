import { app } from "./app";
import { env } from './env'

app.listen(
  {
    port: env.PORT || 3333,
    host: 'RENDER' in process.env ? `0.0.0.0`: `localhost`,
  }
).then(()=>{
  console.log(`Server ouvindo na porta ${env.PORT}`)
})