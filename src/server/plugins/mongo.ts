import type { IGlobalDB } from '~~/types'
import mongoose from 'mongoose';
import Model from '../model'

declare global {
  var DB : IGlobalDB
}

export default defineNitroPlugin(async (nitroApp) => {
  const runtimeConfig = useRuntimeConfig()
  
  await mongoose.connect(runtimeConfig.mongoURI, { 
    dbName: runtimeConfig.mongoDB 
  })
  .then(() => {
    global.DB = Model(mongoose)
  })
  .catch(e => {
    throw createError({ statusCode: 500, message: e.toString() })
  })
})