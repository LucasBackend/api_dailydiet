import { FastifyRequest, FastifyReply } from 'fastify'
import authConfig from '../config/auth'
import {verify} from 'jsonwebtoken'
import AppError from '../utils/appError'

export async function ensureAuthenticated(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const sessionId = request.cookies.sessionId

  if (!sessionId) {
    return reply.status(401).send({
      error: 'Unauthorized',
    })
  }

    
  try{
    const {sub:user_id} = verify(sessionId,authConfig.jwt.secret)
    request.user = {
      id: Number(user_id)
    }
  }catch{
    throw new AppError('Token inválido',401)
  }

  
}