import{Router} from '../common/router'
import * as restify from 'restify'
import{NotFoundError} from 'restify-errors'
import{User} from './usuarios.model'

class UsersRouter extends Router{

  constructor(){
    super()
    this.on('beforeRender', document=>{
      document.password = undefined
    })
  }

  applyRoutes(application: restify.Server){

    application.get('/usuarios',(req,resp,next)=>{
      User.find().then(this.render(resp,next)).catch(next)
    })



    application.get('/usuarios/:id', (req,resp,next)=>{
      User.findById(req.params.id)
      .then(this.render(resp,next)).catch(next)
    })

    application.post('/usuarios', (req,resp,next)=>{
      let user = new User(req.body)
      user.save().then(this.render(resp,next)).catch(next)
    })

    application.put('/usuarios/:id', (req, resp, next)=>{
      const options =  {runValidators: true, overwrite: true}
      User.update({_id:req.params.id}, req.body, options).exec().then(result=>{
        if(result.n){
          return User.findById(req.params.id)
        } else{
          throw new NotFoundError('Documento não encontrado')
        }
      }).then(this.render(resp,next)).catch(next)
    })

    application.patch('/usuarios/:id', (req,resp,next)=>{
      const options = {runValidators: true, new:true}
      User.findByIdAndUpdate(req.params.id, req.body, options)
      .then(this.render(resp,next)).catch(next)
    })

    application.del('/usuarios/:id', (req, resp, next)=>{
      User.remove({_id:req.params.id}).exec().then((cmdResult: any)=>{
        if(cmdResult.result.n){
          resp.send(204)
          return next()
        } else {
          throw new NotFoundError('Documento não encontrado')
        }
        return next()

      }).catch(next)
    })
  }
}

export const usersRouter = new UsersRouter()
