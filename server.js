const express = require('express');

const dotenv = require('dotenv').config();

const swaggerUi = require('swagger-ui-express');

const swaggerJsdoc = require('swagger-jsdoc');

const cors = require('cors');

const { router } = require('./router/main.router');

const app = express();

const PORT = process.env.PORT || 8000;

const swaggerAPIDesc = swaggerJsdoc({
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'Peer Review System',
            version: '1.0.0',
            license: {
                name: "MIT",
                url: "https://spdx.org/licenses/MIT.html",
            },
            contact: {
                name: "LogRocket",
                url: "https://logrocket.com",
                email: "info@email.com",
            },
        },
        servers: [
            {
                url: 'http://localhost:3000',
                description: 'Development server',
            },
        ],
        components: {
            securitySchemes: {
                jwt: {
                    type: "http",
                    scheme: "bearer",
                    in: "header",
                    bearerFormat: "JWT"
                },
            }
        }
    },
    apis: ['./router/*.js']
});

app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerAPIDesc));

app.use(express.json());

app.use(cors())

app.use(router);

app.listen(PORT, () => {
    console.log(`Server running at ${PORT}`);
});