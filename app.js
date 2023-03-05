const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const https = require('https');
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/', (req, res, next) => {
    res.sendFile(__dirname + '/signup.html');
    // next();
});

app.post('/', (req, res) => {
    const firstName = req.body.fname;
    const lastName = req.body.lname;
    const email = req.body.email;

    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName,
                }
            }
        ]
    };

    const jsonData = JSON.stringify(data);
    const url = "https://us21.api.mailchimp.com/3.0/lists/cae94f9cd2";
    const options = {
        method: 'POST',
        auth: "abby1:41568a4112d1b87ab7bf567f03518dda-us21"
    };
    const request = https.request(url, options, (response) => {
        response.on("data", (data) => {
            console.log(data);
        });
        if (response.statusCode === 200) {
            res.sendFile(__dirname + '/success.html');
        } else {
            res.sendFile(__dirname + '/failure.html');
        }
    });

    request.write(jsonData);
    request.end();
});

app.post('/failure', (req, res) => {
    res.redirect('/');
})

app.listen(process.env.PORT || 3000, () => {
    console.log('Server running on port 3000');
});

//API Keys
// 41568a4112d1b87ab7bf567f03518dda-us21

//Audience/List ID
// cae94f9cd2