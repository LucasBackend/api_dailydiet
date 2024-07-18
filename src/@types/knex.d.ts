import {Knex} from 'knex'

declare module 'knex/types/tables'{
export interface Tables{
  users:{
    id: number
    nome: string
    email?: string
    password:string
  },

  snack:{
    id:number,
    id_user:number,
    name: string,
    description: string,
    date_hour: Date,
    create_at: Date,
    update_at: Date,
    inside_or_outside: boolean
  }
}

}