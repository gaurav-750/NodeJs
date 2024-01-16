const http = require("http");
const fs = require("fs");

const server = http.createServer((req, res) => {
  //   console.log(req.url, req.method, req.headers);

  const url = req.url;
  const method = req.method;

  if (url === "/") {
    res.write("<html>");
    res.write("<head><title>Enter message</title></head>");
    res.write(
      "<body> <form action='/message' method='POST'> \
        <input type='text' name='message'/> <button> Submit </button>  </form> \
        </body>"
    );
    res.write("</html>");

    return res.end();
  }

  if (url === "/message" && method === "POST") {
    fs.writeFile("message.txt", "Dummy", (err) => {
      fs.statusCode = 302;
      res.setHeader("Location", "/");
      return res.end();
    });
  }

  //to send response
  res.setHeader("Content-Type", "text/html");

  res.write("<html>");
  res.write("<head><title>My First Page</title></head>");
  res.write("<h1> Hello </h1>");
  res.write("</html>");

  res.end();
});

server.listen(3000);
