import { it, expect, beforeAll, afterAll, describe,beforeEach } from 'vitest'
import {execSync} from 'node:child_process'
import { app } from '../src/app'
import request from 'supertest'

describe('Users routes',()=>{

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

  it('Use can create a new user', async ()=>{
    const response = await request(app.server).post('/users/create').send({
      
        "nome":"Daniel",
        "email":"daniel@hotmail.com",
        "confirmEmail": "daniel@hotmail.com",
        "password": "123"
      
    })
    
    expect(response.statusCode).toEqual(201)
  })

  it('Use can create session',async()=>{
    const responseCreate = await request(app.server).post('/users/create').send({
      "nome":"Daniel",
      "email":"daniel@hotmail.com",
      "confirmEmail": "daniel@hotmail.com",
      "password": "123"
    })

    const response = await request(app.server).post('/users/session').send({
      "email":"daniel@hotmail.com",    
      "password": "123"
    })

    expect(response.statusCode).toEqual(201) && expect(responseCreate.statusCode).toEqual(201)


  })





})