require("dotenv").config();

const express = require("express");
const { createServer } = require("node:http");
const { join } = require("node:path");
const { Server } = require("socket.io");

const app = express();
const server = createServer(app);
const io = new Server(server);

const router = require("./routes/route");
const port = process.env.PORT || 3000;
const jwt = require("jsonwebtoken");

// sentry
const Sentry = require("@sentry/node");
const {ProfilingIntegration} = require("@sentry/profiling-node");

const axios = require("axios");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/", router);

server.listen(port, () => {
  console.log(`app listening on port ${port}`);
});


io.on('connect', (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on('registrationSuccess', (data) => {
    io.to(socket.id).emit('notification', { type: 'success', message: 'Registration successful!' });
  });

  socket.on('loginSuccess', (data) => {
    io.to(socket.id).emit('notification', { type: 'success', message: 'Login successful!' });
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});


// sentry
Sentry.init({
  dsn: process.env.dsn_sentry,
  integrations: [
    // enable HTTP calls tracing
    new Sentry.Integrations.Http({ tracing: true }),
    // enable Express.js middleware tracing
    new Sentry.Integrations.Express({ app }),
    new ProfilingIntegration(),
  ],
  // Performance Monitoring
  tracesSampleRate: 1.0,
  // Set sampling rate for profiling - this is relative to tracesSampleRate
  profilesSampleRate: 1.0,
});

// The request handler must be the first middleware on the app
app.use(Sentry.Handlers.requestHandler());

// TracingHandler creates a trace for every incoming request
app.use(Sentry.Handlers.tracingHandler());

// The error handler must be registered before any other error middleware and after all controllers
app.use(Sentry.Handlers.errorHandler());

// Optional fallthrough error handler
app.use(function onError(err, req, res, next) {
  // The error id is attached to `res.sentry` to be returned
  // and optionally displayed to the user for support.
  res.statusCode = 500;
  res.end(res.sentry + "\n");
});


// Set EJS sebagai view engine
app.set("view engine", "ejs");
app.get("/", (req, res) => {
  res.render("index");
});
app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const response = await axios.post(
      `http://${process.env.URL_ENDPOINT}/api/v1/auth/login`,
      {
        email,
        password,
      },
    );

    if (response.data.message == "success") {
      res.redirect("/dashboard");
    } else {
      res.render("login", { error: `${response.data.message}` });
    }
  } catch (error) {
    // console.error('Error during login:', error);
    res.render("login", {
      error: "An error occurred during login. Please try again later.",
    });
  }
});

app.get("/dashboard", (req, res) => {
  res.render("dashboard");
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const response = await axios.post(
      `http://${process.env.URL_ENDPOINT}/api/v1/auth/register`,
      {
        name,
        email,
        password,
      },
    );

    if (response.data.message == "created success") {
      res.redirect("/login");
    } else {
      res.render("register", { error: `${response.data.message}` });
    }
  } catch (error) {
    console.error("Error during login:", error);
    res.render("register", {
      error: "An error occurred. Please try again later.",
    });
  }
});

app.get("/forgotpassword", (req, res) => {
  res.render("forgotpassword");
});

app.get("/logout", async (req, res) => {
  res.render("index");
});

app.post("/forgotpassword", async (req, res) => {
  const { email } = req.body;

  try {
    const response = await axios.post(
      `http://${process.env.URL_ENDPOINT}/api/v1/auth/forgotpassword`,
      {
        email,
      },
    );

    if (response.data.message == "success") {
      res.render("forgotpassword", {error: "check your email"})
    } else {
      res.render("forgotpassword", { error: `${response.data.message}` });
    }
  } catch (error) {
    // console.error('Error during login:', error);
    res.render("forgotpassword", {
      error: "Error Server. Please try again later.",
    });
  }
});

app.get("/resetpassword/:token", (req, res) => {
  const newUrlReset = req.params.token;
  res.render("resetpassword", { newUrlReset });
});

app.post("/resetpassword/:token", async (req, res) => {
  const { newPassword } = req.body;
  const token = req.params.token;

  try {
    const response = await axios.post(
      `http://${process.env.URL_ENDPOINT}/api/v1/auth/resetpassword/${token}`,
      {
        newPassword,
      },
    );

    if (response.data.message == "success") {
      res.redirect("/login")
    } else {
      res.render("resetpassword", { error: `${response.data.message}` });
    }
  } catch (error) {
    // console.error('Error during login:', error);
    res.render("resetpassword", {
      error: "Error Server. Please try again later.",
    });
  }
});

