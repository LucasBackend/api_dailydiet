import { FastifyReply, FastifyRequest } from "fastify";
import AppError from "../utils/appError";
import { z } from 'zod'
import { knex } from "../database";

export class snackController {

  async createSnack(request:FastifyRequest,reply:FastifyReply){

    const snack_schema = z.object({
      name: z.string(),
      description: z.string(),
      date_hour: z.string().refine((val)=> !isNaN(Date.parse(val)),{
        message:"Invalid datetime format"
      }),
      inside_or_outside: z.boolean()
    })

    const {name,description,date_hour,inside_or_outside} = snack_schema.parse(request.body)

    const id_user = request.user.id
    
    const date_format = new Date(date_hour).toISOString().replace('T', ' ').replace('Z', '');

    await knex('snack').insert({name,description,id_user,inside_or_outside,date_hour:date_format})

    return reply.status(201).send()
    


   
    
  }

  async deleteSnack(request:FastifyRequest,reply:FastifyReply){
    const idSnack = request.params.id
    const {id} = request.user
    
    const snack = await knex('snack').where({id:idSnack}).first()

    if(id !== snack?.id_user || !snack){
      throw new AppError('Sem permissões para deletar este item',401)
    }else{
      await knex('snack').delete().where({id:idSnack})
    }

    return reply.status(201).send()
  }

  async allSnack(request:FastifyRequest,reply:FastifyReply){
    const {id:user_id} = request.user

    const allSnacks = await knex('snack').where({id_user:user_id})


    return reply.status(201).send({
      snack: allSnacks
    })
  }

  async updateSnack(request:FastifyRequest,reply:FastifyReply){
        
    const body_schema = z.object({
      name: z.string(),
      description: z.string(),
      date_hour: z.string().refine((val)=> !isNaN(Date.parse(val)),{
        message:"Invalid datetime format"
      }),
      inside_or_outside: z.boolean()

    })

    body_schema.parse(
      request.body
    )

    const {id} = request.params
    const user_id = request.user.id
   
    const {name,description,date_hour,inside_or_outside} = request.body

    if(!name || !description || !date_hour || inside_or_outside===null){
      throw new AppError('Todos os campos são obrigatórios',401)
    }

    const snack = await knex('snack').where({id}).first()
    
    if(snack?.id_user !== user_id){
      throw new AppError('Você não tem permissão para editar este item',401)
    }

    const date_format = new Date(date_hour).toISOString().replace('T', ' ').replace('Z', '');

    await knex('snack').update({name,description,inside_or_outside,date_hour:date_format,update_at:knex.fn.now()}).where({id})

  
    return reply.status(201).send()



  }

  async paramSnackUser(request:FastifyRequest,reply:FastifyReply){
    const id_user = request.user.id

    let bestSequence = []
    let currentSequence = []

    const allSnack = await knex('snack').where({id_user}).count('id as Total').first()
    const allSnackInside = await knex('snack').where({id_user,inside_or_outside:1}).count('id as Total').first()
    const allSnackOutside = await knex('snack').where({id_user,inside_or_outside:1}).count('id as Total').first()
    const allSnackUser = await knex('snack').where({id_user}).orderBy('date_hour','asc')

    for(let record of allSnackUser){
      if(record.inside_or_outside===1){
        currentSequence.push(record);

        if(currentSequence.length>bestSequence.length){
          bestSequence = [...currentSequence]
        }
      }else{
        currentSequence = []
      }
    }

    return reply.status(201).send({
      'allSnackRegister': allSnack.Total,
      'allSnackInside': allSnackInside.Total,
      'allSnackOutside': allSnackOutside.Total,
      'bestSequence': bestSequence
    })

  }

  async uniqueSnack(request:FastifyRequest,reply:FastifyReply){
    const user_id = request.user.id
    const id_snack = request.params.id

    const snackUnique = await knex('snack').where({id:id_snack}).first()

    if(!id_snack){
      throw new AppError('Identificador da refeição não pode ser nulo',400)
    }

    if(!snackUnique){
      throw new AppError('Está refeição não existe',403)
    }

    if(snackUnique.id_user!==user_id){
      throw new AppError('Está refeição não foi criada por este usuário',401)
    }

    return reply.status(201).send({
      Snack: snackUnique
    })


  }

}