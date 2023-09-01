const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
require('dotenv').config();
app.use(express.json());
app.use(cors())



const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.oth2isl.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        const destinationCollection = client.db('airbnbDB').collection('destinations');

        // get all destinations
        app.get('/all_destinations', async (req, res) => {
            const destinations = await destinationCollection.find().toArray();
            res.send(destinations);
        });



        // get destinations by category
        app.get('/destinations_by_category/:destination_value', async (req, res) => {
            const destination_value = req.params.destination_value;
            const query = { category: destination_value }
            const destinationByCategory = await destinationCollection.find(query).toArray();

            res.send(destinationByCategory);
        });

        // get destinations by search values
        app.post('/destinations_by_search_value', async (req, res) => {
            const searchValues = req.body;
            // console.log(searchValues);
            const { location='', startDate, endDate, totalGust } = searchValues || {};
            console.log(location, startDate, endDate, totalGust, typeof totalGust);
            const destinations = await destinationCollection.find().toArray();
            const destinationBySearchValue = destinations.filter(destination => destination.
                location_name.includes(location) && (destination.available_date.includes(startDate) && destination.available_date.includes(endDate)) && destination.guests >= totalGust
            );

            // console.log(destinationBySearchValue);
            res.send(destinationBySearchValue);
        });





        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);




app.get('/', (req, res) => {
    res.send('airbnb server is running');
})



app.listen(port, () => {
    console.log(`airbnb server is running at port ${port}`);
})






