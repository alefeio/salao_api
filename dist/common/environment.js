"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.environment = {
    server: { port: process.env.SERVER_PORT || 3000 },
    db: { url: process.env.DB_URL || 'mongodb://localhost/nailhear' },
    security: { saltRounds: process.env.SALT_ROUNDS || 10 }
};
