module.exports = ({ env }) => ({
    upload: {
        config: {
            provider: 'aws-s3',
            // rootPath: env('CDN_ROOT_PATH'),
            providerOptions: {
                baseUrl: `${env('S3_ENDPOINT')}/${env('S3_BUCKET')}`,

                s3Options: {
                    credentials: {
                        accessKeyId: env('S3_ACCESS_KEY_ID'),
                        secretAccessKey: env('S3_SECRET_ACCESS_KEY'),
                    },
                    region: env('S3_REGION'),
                    params: {
                        // ACL: env('AWS_ACL', 'public-read'),
                        // signedUrlExpires: env('AWS_SIGNED_URL_EXPIRES', 15 * 60),
                        Bucket: env('S3_BUCKET'),
                    },
                },


                endpoint: env('S3_ENDPOINT'),
                // ForcePathStyle: true,
                // params: {
                //     Bucket: env('S3_BUCKET'),
                //     // baseUrl: `${env('S3_ENDPOINT')}/${env('S3_BUCKET')}`,
                // },
            },
            // forcePathStyle: true,
            actionOptions: {
                upload: {},
                uploadStream: {},
                delete: {},
            },
        },
    }
});


//
// module.exports = ({ env }) => ({
//     upload: {
//         config: {
//             provider: 'custom-provider',
//             providerOptions: {
//                 accessKeyId: env('S3_ACCESS_KEY_ID'),
//                 secretAccessKey: env('S3_SECRET_ACCESS_KEY'),
//                 region: env('S3_REGION', 'us-east-1'),
//                 endpoint: env('S3_ENDPOINT', 'http://localhost:9000'),
//                 bucket: env('S3_BUCKET'),
//                 forcePathStyle: env('S3_FORCE_PATH_STYLE', true),
//             },
//         },
//     },
// });