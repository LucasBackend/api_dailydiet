import { FastifyInstance } from "fastify";
import { ensureAuthenticated } from "../middleware/auth";
import { snackController } from "../Controller/snackController";

const snackcontroller = new snackController()

export async function snackRoutes(app:FastifyInstance){

  app.addHook('preHandler',ensureAuthenticated)

  app.get('/allSnack',snackcontroller.allSnack)
  app.get('/paramsSnack',snackcontroller.paramSnackUser)
  app.get('/uniqueSnack/:id',snackcontroller.uniqueSnack)

  app.post('/create', snackcontroller.createSnack)
  app.post('/updateSnack/:id',snackcontroller.updateSnack)

  app.delete('/delete/:id', snackcontroller.deleteSnack)
 

}