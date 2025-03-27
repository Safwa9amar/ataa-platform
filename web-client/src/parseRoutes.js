const fs = require("fs");
const path = require("path");

function getAppRoutes(dirPath, prefix = "/") {
  let routes = [];
  const files = fs.readdirSync(dirPath);

  files.forEach((file) => {
    const filePath = path.join(dirPath, file);
    const stats = fs.statSync(filePath);

    // If it's a directory, we recursively check for route segments
    if (stats.isDirectory()) {
      // If the directory is a dynamic route, like [param]
      const routeSegment = file.includes("[")
        ? `:${file.replace(/\[|\]/g, "")}`
        : file;

      // Add the route with the prefix
      routes = routes.concat(
        getAppRoutes(filePath, path.join(prefix, routeSegment))
      );
    } else if (stats.isFile() && file.endsWith("page.js")) {
      // Ignore non-page files like layout.js, error.js, etc.
      if (file === "layout.js" || file === "error.js") return;

      // This is a page file, so add the full route
      routes.push({
        pathname: path.join(prefix, file.replace("page.js", "")),
        label: "",
      });
    }
  });

  return routes;
}

// Path to the app directory
const appDir = path.join(__dirname, "app");
const allRoutes = getAppRoutes(appDir);

// Convert routes to JSON object
const routesJson = JSON.stringify(allRoutes, null, 2);
fs.writeFileSync(path.join(__dirname, "routes.json"), routesJson);

console.log("Routes saved to routes.json");
