module.exports = function(config) {
    config.set({
      client: {
        jasmine: {
          random: true,
          seed: '4321',
          oneFailurePerSpec: true,
          failFast: true,
          timeoutInterval: 10000 // <- this is what I was looking for
        }
      }
    })
  }
