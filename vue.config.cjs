module.exports = {
    transpileDependencies: ['vuetify'],
    publicPath: '/home-control',
    configureWebpack: {
        resolve: {
            fallback: { path: false, os: false },
        },
    },
};
