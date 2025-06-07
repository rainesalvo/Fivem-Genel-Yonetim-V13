module.exports = {
    apps: [
      {
        name: "Supervizor",
        script: './raine.js',
        watch: true,
        exec_mode: "cluster",
        max_memory_restart: "2G",
        cwd: "./" 
      }
    ]
  };
  