const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');  
const app = express();
const port = 3000;
const mysql = require('mysql2');
const { pipeline } = require('stream');

stalls = ["Anjappar","Lassi Bae","Sangeetas"];

app.set('view engine','ejs');
app.set('views', path.join(__dirname, ''));

const db = mysql.createConnection({
  host: 'localhost',
  user: 'praveen',
  password: 'Bjan24502#',
  database: 'node',
});

// Connect to MySQL
db.connect();

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'static')));

app.use(bodyParser.json());

// Route to serve the form
app.get('/', (req, res) => {
  res.render('login');
});

// Route to handle form submission
app.post('/submit', (req, res) => {
  const { username, password } = req.body;
  var amt = '';
  const query = 'SELECT password from users where username = ?';
  db.query('SELECT balance from users where username = ?',[username],(err,resl) => {
    if(err){
      res.send('Error:',err);
    }
      amt = resl[0].balance;
  });
  var hist;
  db.query('SELECT * from transactions where username= ? order by ts desc',[username],(err,resl) => {
    if(err){
      res.send('Error:',err);
    }
      hist = resl;
  });

  // Use the query method with a callback to handle asynchronous behavior
  db.query(query, [username],(err,resl)=>{
    if(resl[0].password == password)
    {
      res.render('dashboard',{username,stalls,amt,hist});
    }
    else
    res.send("Invalid credentials");
  });
});

app.post('/subpin', (req, res) => {
  // Parse the JSON body
  const body = req.body;

  // Access username and pin
  const { username, x, amt , stl} = body;

  // Continue with your logic here


  var bal;
  db.query('SELECT balance from users where username = ?',[username],(err,resl) => {
    bal = resl[0].balance;
  });
  db.query('SELECT pin from users where username = ?', [username], (err, resl) => {
    if (err) {
      res.send('Error:',err);
    } else {
      if(resl[0].pin == x)
      {
        var modified = bal-amt;
        db.query('UPDATE users set balance = ? where username = ?',[modified,username]);
        db.query('insert into transactions values(? ,?, ?, CURRENT_TIMESTAMP)',[username,stl,amt]);
        setTimeout(() => {
          res.send('Payment Successful');
        }, 5000);
      }
      else{
        res.send("Incorrect pin");
      }
      // Continue with your logic here
    }
  });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
