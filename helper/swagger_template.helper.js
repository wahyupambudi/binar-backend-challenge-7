const swaggerDefinition = {
    swaggerDefinition: {
        info: {
            title: 'Testing FGA Issue',
            version: '1.0.0',
            description: 'Your API description',
        },
        servers: [
            {
                url: 'http://localhost:8080',
            },
            {
                url: 'http://localhost:3000',
            },
            {
                url: 'https://binar-algorithm-fsw-mock-test-production.up.railway.app',
            },
        ],
    },
    apis: ['./routes/user.route.js'],

}

module.exports = swaggerDefinition
