module.exports = {
    transpileDependencies: ['vuetify'],
    publicPath: '/homecontrol',
    configureWebpack: {
        resolve: {
            fallback: { path: false, os: false },
        },
    },
};
