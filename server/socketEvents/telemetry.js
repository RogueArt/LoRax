module.exports = (socket, io) => {
  socket.on("temperature", () => {
    console.log("Temp sent!");
  });

  socket.on("humidity", () => {
    console.log("Humidity sent!");
  });

  socket.on("soil", () => {
    console.log("Soil sent!");
  });

  socket.on("light", () => {
    console.log("Light sent!");
  });
};
