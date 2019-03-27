"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const router_1 = require("../common/router");
const restify_errors_1 = require("restify-errors");
const usuarios_model_1 = require("./usuarios.model");
class UsersRouter extends router_1.Router {
    constructor() {
        super();
        this.on('beforeRender', document => {
            document.password = undefined;
        });
    }
    applyRoutes(application) {
        application.get('/usuarios', (req, resp, next) => {
            usuarios_model_1.User.find().then(this.render(resp, next)).catch(next);
        });
        application.get('/usuarios/:id', (req, resp, next) => {
            usuarios_model_1.User.findById(req.params.id)
                .then(this.render(resp, next)).catch(next);
        });
        application.post('/usuarios', (req, resp, next) => {
            let user = new usuarios_model_1.User(req.body);
            user.save().then(this.render(resp, next)).catch(next);
        });
        application.put('/usuarios/:id', (req, resp, next) => {
            const options = { runValidators: true, overwrite: true };
            usuarios_model_1.User.update({ _id: req.params.id }, req.body, options).exec().then(result => {
                if (result.n) {
                    return usuarios_model_1.User.findById(req.params.id);
                }
                else {
                    throw new restify_errors_1.NotFoundError('Documento não encontrado');
                }
            }).then(this.render(resp, next)).catch(next);
        });
        application.patch('/usuarios/:id', (req, resp, next) => {
            const options = { runValidators: true, new: true };
            usuarios_model_1.User.findByIdAndUpdate(req.params.id, req.body, options)
                .then(this.render(resp, next)).catch(next);
        });
        application.del('/usuarios/:id', (req, resp, next) => {
            usuarios_model_1.User.remove({ _id: req.params.id }).exec().then((cmdResult) => {
                if (cmdResult.result.n) {
                    resp.send(204);
                    return next();
                }
                else {
                    throw new restify_errors_1.NotFoundError('Documento não encontrado');
                }
                return next();
            }).catch(next);
        });
    }
}
exports.usersRouter = new UsersRouter();
