"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handlerError = (req, resp, err, done) => {
    console.log(err);
    err.toJson = () => {
        return {
            message: err.message
        };
    };
    switch (err.name) {
        case 'MongoError':
            if (err.code === 11000) {
                err.statusCode = 400;
            }
            break;
        case 'ValidationError':
            err.statusCode = 400;
            const messages = [];
            for (let name in err.errors) {
                messages.push({ message: err.errors[name].message });
            }
            err.toJSON = () => ({
                errors: messages
            });
            break;
    }
    done();
};
