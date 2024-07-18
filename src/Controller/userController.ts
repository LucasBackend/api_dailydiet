import { FastifyReply, FastifyRequest } from "fastify";
import AppError from "../utils/appError";
import { z } from 'zod'
import { knex } from "../database";
import bcrypto from 'bcryptjs'
import authConfig from '../config/auth'
import {sign} from 'jsonwebtoken'


export class userController {

  async createUser(request:FastifyRequest,reply:FastifyReply){
    
    const user_schema = z.object({
      nome: z.string(),
      email: z.string(),
      confirmEmail: z.string(),
      password: z.string()
    })

    const {nome,email,confirmEmail,password} = user_schema.parse(request.body)

    if(!nome || !email || !confirmEmail || !password){
      throw new AppError('Favor enviar nome,email,email de confirmação e senha')
    }

    if(email !== confirmEmail){
      throw new AppError('O email e email de confirmação são diferentes')
    }
    
    
    const user = await knex('users').where('email',email).first()
  
    if(user){
      throw new AppError('Usuário já cadastrado com este email!')
    }

    const crypto_password = await bcrypto.hash(password,10)

    await knex('users').insert({
      nome,
      email,
      password: crypto_password
    })
    
    return reply.status(201).send()

   
    
  }

  async createSession(request:FastifyRequest,reply:FastifyReply){

    const user_schema = z.object({
      email: z.string(),
      password: z.string()
    })

    const {email,password} = user_schema.parse(request.body)

    const user = await knex('users').where({email}).first()

    if(user){
      const senha = await bcrypto.compare(password,user.password)

      if(!senha){
        throw new AppError('Usuário ou senha inválido',401)
      }

    }else{
      throw new AppError('Usuário ou senha inválido',401)
    }

    const {secret,expiresIn} = authConfig.jwt

    const token = sign({},secret,{
      subject: String(user.id),
      expiresIn
    })
    
    reply.cookie('sessionId',token,{
      path:'/',
      maxAge: 60*60*24*7
    })

    return reply.status(201).send()
   

  }


}