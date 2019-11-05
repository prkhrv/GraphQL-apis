const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
var mongoose = require('mongoose');


const { buildSchema } = require('graphql');

const app = express();
app.use(bodyParser.json());


// mongoose instance connection url connection
mongoose.Promise = global.Promise;
const dbConfig = require('./config/database.config.js');
// Connecting to the database 
mongoose.connect(dbConfig.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex:true,
    useFindAndModify: false,
}).then(() => {
    console.log("Successfully connected to the database");
}).catch(err => {
    console.log('Could not connect to the database. Exiting now...', err);
    process.exit();
});



app.use('/graphql', graphqlHttp({
    schema: buildSchema(`
    type Event {
        _id:ID!
        title: String!
        description: String!
        price: Float!
        date: String!

    }
    input EventInput {
        title:String!
        description: String!
        price: Float!
        date: String!
    }
    type RootQuery {
        events : [Event!]!
    }

    type RootMutation {
        createEvent(eventInput: EventInput): Event
    }
    schema {
            query: RootQuery
            mutation: RootMutation

        }
    `),
    rootValue:{
        events:() =>{
            return ['Hey','Shenigami'];
        },
        createEvent: (args) =>{
            const eventName = args.name;
            return eventName;

        }
    },
    graphiql:true
 })
);

app.listen(3000,function(){
    console.log("Server started at 3000");
});