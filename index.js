require("dotenv").config();

const express = require("express");
const app = express();
const router = require("./routes/route");
const port = process.env.PORT || 3000;
const axios = require('axios');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/", router);

// Set EJS sebagai view engine
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('index', { title: 'Express with EJS', message: 'WELCOME CHALLENGE BINAR BACKEND CHAPTER' });
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const response = await axios.post('http://localhost:8080/api/v1/auth/login', {
      email,
      password,
    });

    if (response.data.message == "success") {
      res.redirect('/dashboard');
    } else {
      res.render('login', { error: `${response.data.message}`});
    }
  } catch (error) {
    // console.error('Error during login:', error);
    res.render('login', { error: 'An error occurred during login. Please try again later.' });
  }
});

app.get('/dashboard', (req, res) => {
    res.render('dashboard');
})

app.get('/register', (req, res) => {
    res.render('register')
});

app.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const response = await axios.post('http://localhost:8080/api/v1/auth/register', {
      name,
      email,
      password,
    });

    if (response.data.message == "created success") {
      res.redirect('/login');
    } else {
      res.render('register', { error: `${response.data.message}`});
    }
  } catch (error) {
    console.error('Error during login:', error);
    res.render('register', { error: 'An error occurred. Please try again later.' });
  }
});

app.get('/forgotpassword', (req, res) => {
    res.render('forgotpassword')
});

app.get('/logout', async (req, res) => {
  res.render("index")  
});

app.post('/forgotpassword', async (req, res) => {
  const { email } = req.body;

  try {
    const response = await axios.post('http://localhost:8080/api/v1/auth/forgotpassword', {
      email,
    });

    if (response.data.message == "success") {
      res.render('forgotpassword', { error: `${response.data.message}`});
    } else {
      res.render('forgotpassword', { error: 'Login failed. Please check your credentials.'});
    }
  } catch (error) {
    // console.error('Error during login:', error);
    res.render('forgotpassword', { error: 'Error Server. Please try again later.' });
  }
});

app.get('/resetpassword/:token', (req, res) => {

  const newUrlReset = req.params.token;
  // console.log(newUrlReset)

  res.render('resetpassword', {newUrlReset})
});

app.post('/resetpassword/:token', async (req, res) => {
  const {newPassword} = req.body;
  const token = req.params.token;

  console.log(token)

  try {
    const response = await axios.post(`http://localhost:8080/api/v1/auth/resetpassword/${token}`, {
      newPassword,
    });

    if (response.data.message == "success") {
      res.render('resetpassword', { error: `${response.data.message}`});
    } else {
      res.render('resetpassword', { error: 'Login failed. Please check your credentials.'});
    }
  } catch (error) {
    // console.error('Error during login:', error);
    res.render('resetpassword', { error: 'Error Server. Please try again later.' });
  }
})


app.listen(port, () => {
  console.log(`app listening on port ${port}`);
});
