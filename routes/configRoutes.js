const indexR = require("./index");
const usersR = require("./users");
const projectsR = require("./projects");
const filesR = require("./files");



exports.routesInit = (app) => {
  app.use("/",indexR);
  app.use("/users",usersR);
  app.use("/projects",projectsR);
  app.use("/files",filesR);
}