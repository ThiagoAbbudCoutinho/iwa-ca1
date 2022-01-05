//iinstantiate modules
const { ADDRCONFIG } = require('dns');
const express = require('express')
//path functions
var path = require('path');
//export express app as the root/main app of this server
var app = module.exports = express();

//set template engine to ejs
app.engine('.html', require('ejs').__express);
// Optional since express defaults to CWD/views
app.set('views', path.join(__dirname, 'views'));
// Path to our public directory
app.use(express.static(path.join(__dirname, 'public')));

//set view engine and extension
app.set('view engine', 'html');

// Dummy coins
var coins = [
  { id: 1, key: 'BTC' },
  { id: 2, key: 'ETH'},
  { id: 3, key: 'LTC' },
  { id: 4, key: 'ADA' }
];


//API ENDPOINTS
//configure routes
//root route/home
app.get('/', function (req, res) {

  //remember after this line .send function then request is complete and cannot be further modified
  //NEVER forget to have last line of these functions as res.send, .end, .status().end i.e. always a method
  //that will end the request explicitly
  //res render sends page back to browser as the response
  res.render('coins', {
    coins: coins,
    title: "Crypto CrudR",
    header: "Some coins"
  });
  //res.send('Hello World')
})

// Method: GET
//this equals to retrieval
app.get('/getCoins', function (req, res) {
    //endpoint security
    if(req.method !== 'GET'){
        res.send('You have to use a different METHOD Type for this request')
    }

    const key = req.query.key;

    if(key !== 'OV£RK989L1'){
        //send model to clienc
        res.send('Supplied key in param was incorrect. Please try again')
    } 

    //send model to client
    //here we send status first then the data which is the coins json/model
    res.status(200).json(coins)
  })


// Method: POST
//this equals to CREATION
app.post('/addCoin', (req, res)  => {
    //field sanitisation 
    if (req.query.coin.length < 3 ) {
        return res.status(400).send({ msg: 'Length of Coin Key must be MIN of 3' });
    } 
    if (req.query.coin.length > 3 ) {
        return res.status(400).json({ msg: 'Length of Coin Key must be a MAX of 3' });
    } 

    //to add a coin the endpoint must have security param too
    //just for demo sake we are using same code
    const key = req.query.key;

    if(key !== 'OV£RK989L1'){
        //send model to clienc
        res.send('Supplied key in param was incorrect. Please try again')
    } 

    //check coin to be added
    console.log(req.query.coin)
    //add item to model by getting coins length and it's pos then add new id by incrementing
    var last = coins[coins.length - 1]
    coins.push({id: last.id + 1, key: req.query.coin})
    console.log(coins);

    //end request by responding with a msg
    //here we don't send status but we could if we wanted and instead only send a json message with the 
    //added coin
    res.send({ 'We have just added a new coin': req.query.coin})    
})

// Method: DELETE
//this equals to CREATION
app.delete('/deleteCoin/:id', (req, res) => {
    //if no security key supplied coin will NOT be deleted
    const key = req.query.key;

    if(key !== 'OV£RK989L1'){
        //send model to clienc
        res.send('Supplied key in param was incorrect. Please try again')
    } 

        // Reading id from the URL
        const id = req.params.id;
        console.log(id)
        //find it in array
        const toDelete = coins.find(coin => coin.id === Number(id))

        console.log(id, toDelete)

        if(toDelete){
            console.log(id, toDelete)

            //find the coin in the array and return only if it matches the id we are requesting
            let index = coins.findIndex(function(row){return row.id == id; });
            //if it greater than -1 i.e. if 1 exists then use splice to remove at given position (index)
            if (index > -1) {
                coins.splice(index, 1);
            }
              
            //return success status
            res.status(200).json('coin is deleted');
        } else {
            res.status(404).json({message: 'coin does not exist'})
        }
})

//start app and listen to changes on port
app.listen(3000)

//DATA DISAPPEARS WHEN SERVER IS SWITCHED OFF SO NOT PERSISTING
//WE COULD KEEP IT FORVER IF WE USED A DB LIKE MONGODB