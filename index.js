const express = require('express');
const morgan = require('morgan');
const cors = require('cors')
const app = express();

// We're activating the json parser
// Here we are using a middleware
app.use(express.json());

morgan.token('body', 
     function (req, res) {
          return JSON.stringify(req.body);
     }
);

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

app.use(cors("*"));

// Example of creating and using our own middleware
// const requestLoggerMiddleware = (request, response, next) => {
//      console.log('Method: ', request.method)
//      console.log('Path: ', request.path)
//      console.log('Body: ', request.body)
//      console.log('---')
//      next()          
// }

// To insert the middleware, we use:
// app.use(requestLoggerMiddleware)

// console.log(JSON.stringify(res.body))



let notes = [  
    {    id: "1",
         content: "HTML is easy",    
         important: true  
    },  
    {    id: "2",    
         content: "Browser can execute only JavaScript",    
         important: false  
    },
    {    id: "3",    
         content: "GET and POST are the most important methods of HTTP protocol",    
         important: true  
    }, 
    {
     id:"4",
     content:"This is a test",
     import: false
    }
];

app.get('/', (request, response) => {
     response.send('<h1>Hello World!</h1>')
});

app.get('/api/notes', (request, response) => {
     response.json(notes)
});
// Fetching a single resource
app.get('/api/notes/:id', (request, response) => {
     const id = request.params.id
     // If the find method doesnt find anything
     // it returns undefined which cause a 200 ok response status
     const note = notes.find(note => note.id === id)

     // we handle the undefined note value 
     // and regular responses below
     if (note) {
          response.json(note)
     } else {
          // Sending a personalized error messsage to the user
          response.statusMessage = 'This resource is not accessible at this moment'
          response.status(404).end()
     }
});

app.delete('/api/notes/:id', async(request, response) => {
     const id = request.params.id
     notes = notes.filter(note => note.id !== id)

     response.status(204).end()
})

const generatedId = () => {
     const maxId = notes.length > 0
          ? Math.max(...notes.map(n => Number(n.id)))
          : 0
     return String(maxId)
}

app.post('/api/notes', (request, reponse) => {
     const body = request.body
    
     if (!body.content) {
          return reponse.status(400).json({
               error:'Content missing'
          })
     }

     const note = {
          content: body.content,
          important: body.important || false,
          id: generatedId(),
     }

     notes = notes.concat(note)

     reponse.json(note)

     console.log(request.headers)
});

/**
 * Middleware functions have to be used before routes 
 * when we want them to be executed by the route event handlers. 
 * Sometimes, we want to use middleware functions after routes.
 * We do this when the middleware functions are only called 
 * if no route handler processes the HTTP request.
 * 
 * Let's add the following middleware after our routes. 
 * This middleware will be used for catching requests made 
 * to non-existent routes. For these requests, the middleware 
 * will return an error message in the JSON format.
 * 
 */

const unknownEndPoint = (request, response) => {
     response.status(404).send({error: 'unknown endpoint'});
}

app.use(unknownEndPoint)

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
     console.log(`Server running on http://localhost:${PORT}`)     
});