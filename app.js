
//getting packages
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');

//making express app
const app = express();

//using required packages
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

//connecting to mongodb using mongoose
mongoose.connect("mongodb://localhost:27017/wikiDB",{ useNewUrlParser: true, useUnifiedTopology: true });

//creating a schema for the articles in db
const articleSchema = {
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    }
};

//made a model, which creates or refers to the collection in db.
const Article = mongoose.model("Article", articleSchema);

//MAIN OPERATIONS FOR THE API

//CREATING CHANIED ROUTE HANDLING
///////////////////////REQS TARGETTING ALL ARTICLES
app.route("/articles")
//doing a get response for /articles that uses the Model.find method in mongoose
.get(function(req,res){
    Article.find(function(err, foundArticles){
        if(!err){
            res.send(foundArticles);        

            
        }
        console.log(err);



    });
})
//creating a POST request option that creates one new articles and adds it to collection and db
.post(function(req,res){

    // making a new article const modeled after the Article Model in in mongoose
    const newArticle = new Article({
        title: req.body.title,
        content: req.body.content
    });
    
    //saving the new article but this time we have a callback that sends success message / or an error if there was one. 
    newArticle.save(function(err){
        if(!err){
            res.send("successfully added new article");
        }else{
            res.send(err);
        }
    });
})
//creating a DELETE route for our API, that deletes all articles
.delete(function(req,res){

    //using deleteMany
    Article.deleteMany(function(err){
        if(!err){
            res.send("all articles deleted succesfuly")
        }else{
            res.send(err)
        }
    })
});


///////////////////////REQS TARGETTING SPECIFIC ARTICLES
app.route("/articles/:articleTitle")
//get a specific article
.get(function(req,res){
    Article.findOne({title:req.params.articleTitle},function(err, foundArticle){
        if(!err){
            res.send(foundArticle);        

            
        }
        else{
            console.log(err);

        }



    });
})
//update a specific article, namely a put request
.put(function(req,res){
    //tapping into articles
    Article.update(
        //condition
        {title :req.params.articleTitle},
        //actual upadate to make
        {title: req.body.title, content: req.body.content},
        //overwrite
        {overwrite:true},
        //callback func
        function(err){
            if(!err){
                res.send("successfully updated")
            }else{
                res.send(err);
            }
        }
    )
})
//update specifc article only with fields provided
.patch(function(req,res){
    //targeting Article
    Article.update(
        {title:req.params.articleTitle},
        //here body parser is literally going through the requests, and 
        //the set flag makes it so that only the specified(parsed) fields are updated
        {$set : req.body},
        function(err){
            if(!err){
                res.send("successfully updated")
            }else{
                res.send(err)
            }
        }
        )
})
.delete(function(req,res){
    //targeting article
    Article.deleteOne(
        {title:req.params.articleTitle},
        function(err){
            if(!err){
                res.send("successfully deleted the specified article")
            }else{
                res.send(err)
            }
        }
    )
});





















//listening on port 3000
app.listen(3000, function() {
    console.log("Server started on port 3000");
  });



/*

OLD WAY OF CREATING ROUTES. KEEPING FOR POSSIBLE LATER REFERENCE.

//doing a get response for /articles that uses the Model.find method in mongoose
app.get("/articles", function(req,res){
    Article.find(function(err, foundArticles){
        if(!err){
            res.send(foundArticles);        

            
        }
        console.log(err);



    });
});

//creating a POST request option that creates one new articles and adds it to collection and db
app.post("/articles", function(req,res){

    // making a new article const modeled after the Article Model in in mongoose
    const newArticle = new Article({
        title: req.body.title,
        content: req.body.content
    });
    
    //saving the new article but this time we have a callback that sends success message / or an error if there was one. 
    newArticle.save(function(err){
        if(!err){
            res.send("successfully added new article");
        }else{
            res.send(err);
        }
    });
})

//creating a DELETE route for our API, that deletes all articles
app.delete("/articles", function(req,res){

    //using deleteMany
    Article.deleteMany(function(err){
        if(!err){
            res.send("all articles deleted succesfuly")
        }else{
            res.send(err)
        }
    })
})

*/



