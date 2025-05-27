const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

config.resolver.sourceExts.push('sql'); // <--- add this

config.resolver = {
    ...config.resolver,
    alias: {
        '@': path.resolve(__dirname, 'src'),
        '@db': path.resolve(__dirname, 'src/db'),
    }
}

module.exports = config;
