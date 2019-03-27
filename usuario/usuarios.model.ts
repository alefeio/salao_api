import * as mongoose from 'mongoose'
import {validateCPF} from '../common/validators'
import * as bcrypt from 'bcrypt'
import {environment} from '../common/environment'

export interface User extends mongoose.Document {
  name:String,
  email: String,
  password: String
}

const userSchema = new mongoose.Schema({ // usar o schema para informar ao mongoose quais são os nossos meta dados
  name:{
    type: String,
    required: true, // não pode adicionar sem passar o nome
    maxlength: 80, // maximo de caracteres de nome
    minlength: 2 // minimo de caracteres de nome
  },
  email:{
    type: String,
    unique: true,// sendo unico, não pode ter repetido
    required: true,
    match: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/


  },
  password:{
    type: String,
    select: false, // não aparecer em amostra
    required: true
  },
  gender:{
    type: String,
    required: false,
    enum: ['Male', 'Female']
  },
  cpf:{
    type: String,
    require: false,
    validate:{
      validator: validateCPF,
      message:'{PATH}: Invalid CPF({VALUE})'
    }
  }
})

const hashPassword = (obj, next)=>{
  bcrypt.hash(obj.password, environment.security.saltRounds)
  .then(hash=>{
    obj.password = hash
    next()
  }).catch(next) // nossa criptografia
}

const saveMiddleware = function (this: User, next){
  if(!this.isModified('password')){
    next()
  } else{
      hashPassword(this, next) // possivel erro
  }
}
const updateMiddleware = function (this: mongoose.Query<User>, next){ // precisei tipar o this logo no primeiro argumento devido a alguma falta de atualização do typescript
  if(!this.getUpdate().password){
    next()
  } else{
    hashPassword(this.getUpdate(), next)
  }
}

userSchema.pre('save', saveMiddleware)
userSchema.pre('findOneAndUpdate', updateMiddleware)
userSchema.pre('update', updateMiddleware)

export const User = mongoose.model<User>('User', userSchema) // o que vai fazer a manipulação dos documentos
