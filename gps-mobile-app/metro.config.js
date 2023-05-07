module.exports = {
    transformer: {
      getTransformOptions: async () => ({
        transform: {
          experimentalImportSupport: false,
          inlineRequires: false,
        },
      }),
    },
    resolver: {
        sourceExts: ['js', 'json', 'ts', 'tsx', 'cjs']
    },
  };