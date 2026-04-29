const swaggerJsdoc = require('swagger-jsdoc');
const fs = require('fs');
const path = require('path');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'CodeMind API Documentation',
            version: '1.0.0',
            description: 'Tài liệu API cho toàn bộ các endpoints trong dự án CodeMind E-Learning.'
        },
        servers: [
            {
                url: 'http://localhost:3000',
                description: 'Development Server'
            }
        ],
        components: {
            securitySchemes: {
                BearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT'
                }
            }
        },
        security: []
    },
    apis: [path.join(__dirname, '../src/app/api/**/*.ts'), path.join(__dirname, '../src/app/api/**/*.js')]
};

try {
    const spec = swaggerJsdoc(options);
    fs.writeFileSync(path.join(__dirname, '../public/swagger.json'), JSON.stringify(spec, null, 2));
    console.log('Swagger JSON generated at public/swagger.json');
} catch (e) {
    console.error('Failed to generate Swagger JSON:', e);
}
