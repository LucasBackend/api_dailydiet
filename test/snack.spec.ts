import { it, expect, beforeAll, afterAll, describe,beforeEach } from 'vitest'
import {execSync} from 'node:child_process'
import { app } from '../src/app'
import request from 'supertest'

describe('Snack routes',()=>{

  beforeAll(async()=>{
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  beforeEach(()=>{
    execSync('npm run knex migrate:rollback --all')
    execSync('npm run knex migrate:latest')
  })

  it('Use can create snack',async()=>{
    const responseCreateUser = await request(app.server).post('/users/create').send({
      "nome":"Daniel",
      "email":"daniel@hotmail.com",
      "confirmEmail": "daniel@hotmail.com",
      "password": "123"
    })

    const responseSession = await request(app.server).post('/users/session').send({
      "email":"daniel@hotmail.com",    
      "password": "123"
    })

    const cookies = responseSession.headers['set-cookie']

    const responseCreateSnack = await request(app.server).post('/snack/create')
    .set('Cookie',cookies)
    .send({
      "name":"teste12",
      "description":"description teste2",
      "date_hour": "2023-07-15T15:30:00Z",
      "inside_or_outside": true
    })
 
   
    
    expect(responseSession.statusCode).toEqual(201) && expect(responseCreateUser.statusCode).toEqual(201) && expect(responseCreateSnack.statusCode).toEqual(201)


  })





})