const swaggerJsdoc = require('swagger-jsdoc');
const path = require('path');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Test API',
            version: '1.0.0'
        }
    },
    apis: [path.join(process.cwd(), 'src/app/api/**/*.ts')]
};

try {
    const spec = swaggerJsdoc(options);
    console.log(spec);
} catch (e) {
    console.error(e);
}
