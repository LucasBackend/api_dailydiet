import { FastifyInstance } from "fastify";
import {userController} from '../Controller/userController'

const usercontroller = new userController()

export async function usersRoutes(app:FastifyInstance){

  app.post('/create',usercontroller.createUser)
  app.post('/session',usercontroller.createSession)
 

}