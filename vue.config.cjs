module.exports = {
    transpileDependencies: ['vuetify'],
    configureWebpack: {
        resolve: {
            fallback: { path: false, os: false },
        },
    },
};
