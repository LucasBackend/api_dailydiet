import fastify from 'fastify'
import { usersRoutes } from './routes/user.routes'
import AppError from './utils/appError'
import cookie from '@fastify/cookie'
import { snackRoutes } from './routes/snack.routes'

export const app = fastify()

app.register(cookie)
app.register(usersRoutes,{prefix:'/users'})
app.register(snackRoutes,{prefix:'snack'})
app.setErrorHandler((error,request,reply)=>{
  if(error instanceof AppError){
    return reply.status(error.statusCode).send({
      "status": error.statusCode,
      "message": error.message
    })
  }else{
    return reply.status(500).send({
      "status": 500,
      "message": error.message
    })
  }
}
)