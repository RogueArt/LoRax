module.exports = (socket, io) => {
  socket.on("temperature", (data) => {
    console.log("Temp sent!");
  });

  socket.on("humidity", (data) => {
    console.log("Humidity sent!");
  });

  socket.on("soil", (data) => {
    console.log("Soil sent!");
  });

  socket.on("light", (data) => {
    console.log("Light sent!");
  });
};
