import path from 'path';

import 'longjohn';

import Metalsmith from 'metalsmith';

import markdown from 'metalsmith-markdown';
import layouts from 'metalsmith-layouts';
import serve from 'metalsmith-serve';
import watch from 'metalsmith-watch';
import sass from 'metalsmith-sass';
import autoprefixer from 'metalsmith-autoprefixer';
import webpack from 'metalsmith-webpack';
import imagemin from 'metalsmith-imagemin';

const isBuildOnly = process.env.NODE_ENV === 'build';
const skipImageOptimization = !!process.env.SKIP_IMAGE_OPTIMIZATION;

new Metalsmith('./')
    .source('./content')
    .destination('./build')
    .metadata({
        production: isBuildOnly,
        currentYear: (new Date()).getFullYear(),
    })
    .use(markdown({
        gfm: true,
    }))
    .use(layouts({
        engine: 'handlebars',
        partials: 'partials',
    }))
    .use(sass({
        outputStyle: isBuildOnly ? 'compressed' : 'expanded',
        outputDir: 'css/',
    }))
    .use(autoprefixer({}))
    .use(webpack({
        entry: {
            app: [path.resolve(__dirname, './js/script.js')],
        },
        output: {
            path: path.resolve(__dirname, './build/js'),
            filename: 'script.js',
        },
        module: {
            loaders: [
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    loader: 'babel-loader',
                    query: {
                        presets: [
                            ['env', {
                                targets: {
                                    node: 6,
                                },
                            }],
                        ],
                    },
                },
                // could not make ProvidePlugin work to save my life
                {
                    test: require.resolve('jquery'),
                    loader: 'expose-loader?jQuery!expose-loader?$',
                },
            ],
        },
        plugins: [
            // new wp.ProvidePlugin({
            //     $: 'jquery',
            //     jQuery: 'jquery',
            //     jquery: 'jquery',
            // }),
            // @TODO why is this acting up...
            // new wp.optimize.UglifyJsPlugin({
            //     compress: {
            //         warnings: false,
            //     },
            //     output: {
            //         comments: false,
            //     },
            // }),
        ],
    }))
    .use(isBuildOnly && !skipImageOptimization ? imagemin({
        optimizationLevel: 3,
        svgoPlugins: [{ removeViewBox: false }],
    }) : noop)
    .use(isBuildOnly ? noop : serve({
        port: 4444,
    }))
    .use(isBuildOnly ? noop : watch({
        paths: {
            '${source}/**/*': true,
            'layouts/**/*': '**/*',
            'partials/**/*': '**/*',
            'js/**/*': '**/*',
        },
        livereload: true,
    }))
    .build(err => { if (err) throw err; });

function noop() {}
