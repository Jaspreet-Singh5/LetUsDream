var express          = require("express"),
    app              = express();

var expressSanitizer    = require("express-sanitizer"),
    methodOverride      = require("method-override"),
    LocalStrategy       = require("passport-local"),
    middleware          = require("./middleware"),
    middlewareBlog      = require("./middlewareBlog"),
    mongoose            = require("mongoose"),
    passport            = require("passport"),
    flash               = require("connect-flash"),
    Event               = require("./models/event"),
    Press               = require("./models/press"),
    Video               = require("./models/video"),
    Contact             = require("./models/contact"),
    Participant         = require("./models/participant"),
    User                = require("./models/user"),
    Comment             = require("./modelsBlog/comment"),
    Blog                = require("./modelsBlog/blog"),
    body                = require("body-parser");
    
// EXPRESS CONFIG
app.use(require("express-session")({
    secret: "the pancake that john gave me to eat yesterday, was very bad in taste.",
    resave: false,
    saveUninitialized: false,
}));

// PASSPORT CONFIG
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(flash());

// middleware
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

// APP CONFIG
mongoose.connect("mongodb://JaspreetSingh:jaspreet1999@ds231360.mlab.com:31360/letusdream");
// mongoose.connect("mongodb://localhost/LetUsDream");
app.set("view engine", "ejs");
app.use(body.urlencoded({extended: true}));
app.use(express.static("public"));
app.use(methodOverride("_method"));
app.use(expressSanitizer());

    
// APP CONFIG
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

// LANDING PAGE
app.get("/", function(req, res){
    res.redirect("/index");
});

// index PAGE
app.get("/index", function(req, res){
    Event.find({}, function(err, events){
        if(err)
        {
            console.log(err);
        }
        else
        {
            res.render("index", {events : events});   
        }
    })
});


// create event
app.post("/index", middleware.isLoggedIn, function(req, res){
    req.body.event.coordinators = req.sanitize(req.body.event.coordinators);
    req.body.event.desc = req.sanitize(req.body.event.desc);

    var author = {
      id: req.user._id,
      username: req.user.username,
    };
    
    req.body.event.author = author;
    
    Event.create(req.body.event, function(err, newEvent){
        if(err){
            res.render("/manageEvents");
        }
        
        else{
            res.redirect("/index");
        }
    });
});

// show event
app.get("/events/:id", function(req, res) {
    Event.findById(req.params.id, function(err, event){
        if(err){
            console.log(err);
        }
        
        else{
            res.render("show", { event: event });
        }
    });
});

// View more Details
app.get("/moreDetails", function(req, res){
    res.render("moreDetails.ejs");
});

// About us
app.get("/aboutUs", function(req, res){
    res.render("about-us.ejs");
});

// contact
app.post("/contactus", function(req, res){
    Contact.create(req.body.contact, function(err, newContact){
        if(err){
            console.log("err");
            res.render("/index");
        }
        
        else{
            console.log(newContact.email);
            res.redirect("/index");
        }
    });
});


// dreams band
app.get("/dreams/dreamsband", function(req, res){
    res.render("dreamsband.ejs");
});

// dreams programme
app.get("/dreams/dreamsprogramme", function(req, res){
    res.render("dreamsprogramme.ejs");
});

// dreams pro
app.get("/dreams/dreamspro", function(req, res){
    res.render("dreamspro.ejs");
});

// press
app.get("/media/press", function(req, res){
    Press.find({}, function(err, press){
        if(err)
        {
            console.log(err);
        }
        else
        {
            res.render("press", {press : press});   
        }
    });
});

// create press image
app.post("/media/press", middleware.isLoggedIn, function(req, res){
    req.body.press.desc = req.sanitize(req.body.press.desc);

    var author = {
      id: req.user._id,
      username: req.user.username,
    };
    
    req.body.press.author = author;
    
    Press.create(req.body.press, function(err, newPress){
        if(err){
            res.render("/managePress");
        }
        
        else{
            res.redirect("/media/press");
        }
    });
});

// show press image
app.get("/press/:id", function(req, res) {
    Press.findById(req.params.id, function(err, press){
        if(err){
            console.log(err);
        }
        
        else{
            res.render("showPress", { press: press });
        }
    });
});


// videos
app.get("/media/videos", function(req, res){
    Video.find({}, function(err, video){
        if(err)
        {
            console.log(err);
        }
        else
        {
            res.render("videos.ejs", {video : video});   
        }
    })
});

// create video
app.post("/media/videos", middleware.isLoggedIn, function(req, res){
    req.body.video.desc = req.sanitize(req.body.video.desc);

    var author = {
      id: req.user._id,
      username: req.user.username,
    };
    
    req.body.video.author = author;
    
    Video.create(req.body.video, function(err, newVideo){
        if(err){
            res.render("/manageVideos");
        }
        
        else{
            res.redirect("/media/videos");
        }
    });
});

// =======================
// admin auth routes
// =======================

// login
app.get("/login", function(req, res){
    res.render("login");
});

// login logic
app.post("/login",passport.authenticate("local",{
    successRedirect: "/cmsIndex",
    failureRedirect: "/login",
}), function(req, res){
});

// logout logic
app.get("/logout",function(req, res){
    req.logout();
    res.redirect("/index");
});

// ===========================

// participant registration
app.get("/register", function(req, res) {
    res.render("register");
});

// register participant
app.post("/register", function(req, res){
    
    Participant.create(req.body.participant, function(err, newParticipant){
        if(err){
            console.log(err);
            res.render("register.ejs");
        }
        
        else{
            res.redirect("/index");
        }
    });
});

// =======================
// CMS
// =======================

app.get("/cmsIndex", middleware.isLoggedIn, function(req, res) {
    res.render("cmsIndex");
});

app.get("/manageEvents", middleware.isLoggedIn, function(req, res) {
    res.render("manageEvents");
});

app.get("/manageVideos", middleware.isLoggedIn, function(req, res) {
    res.render("manageVideos");
});

app.get("/managePress", middleware.isLoggedIn, function(req, res) {
    res.render("managePress");
});

app.get("/manageRegisteredParticipants", middleware.isLoggedIn, function(req, res) {
    Participant.find({}, function(err, participants){
        if(err)
        {
            console.log(err);
        }
        else
        {
            res.render("manageRegisteredParticipants", {participants : participants});   
        }
    });
});

// =======================

// ================
// blog routes
// ================

// INDEX
app.get("/blogs", function(req, res){
    Blog.find({}, function(err, blogs){
        if(err)
        {
            console.log(err);
            req.flash("error",err.message);
        }
        else
        {
            res.render("blogs/index", {blogs : blogs});   
        }
    })
});

// NEW
app.get("/blogs/new", middlewareBlog.isLoggedIn, function(req, res){
   res.render("blogs/new"); 
});

// CREATE
app.post("/blogs", middlewareBlog.isLoggedIn, function(req, res){
    req.body.blog.body = req.sanitize(req.body.blog.body);

    var author = {
      id: req.user._id,
      username: req.user.username,
    };
    
    req.body.blog.author = author;
    
    Blog.create(req.body.blog, function(err, newBlog){
        if(err){
            res.render("blogs/new");
            req.flash("error",err.message);
        }
        
        else{
            res.redirect("/blogs");
        }
    });
});

// SHOW
app.get("/blogs/:id", function(req, res){
    Blog.findById(req.params.id).populate("comments").exec(function(err, foundBlog){
        if(err){
            res.redirect("/blogs");
            req.flash("error",err.message);
        }
        else{
            res.render("blogs/show", {blog: foundBlog});
        }
    })
})

// EDIT
app.get("/blogs/:id/edit", middlewareBlog.checkBlogOwnership, function(req, res) {
    Blog.findById(req.params.id, function(err, foundBlog)
    {
        if(err){
            res.redirect("/blogs");
            req.flash("error",err.message);
        }
        
        else{
             res.render("blogs/edit", {blog: foundBlog});
        }
    });
});

// Update
app.put("/blogs/:id", middlewareBlog.checkBlogOwnership, function(req, res){
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updateBlog){
        if(err){
            res.redirect("/blogs");
            req.flash("error",err.message);
        }
        
        else{
            res.redirect("/blogs/" + req.params.id);
        }
    })
})

// DELETE
app.delete("/blogs/:id", middlewareBlog.checkBlogOwnership, function(req, res){
    Blog.findByIdAndRemove(req.params.id, function(err)
    {
        if(err){
            res.redirect("/blogs");
            req.flash("error",err.message);
        }
        else{
            res.redirect("/blogs");
        }
    })
})

// ================
// Auth routes
// ================

// register form
app.get("/registerBlog",function(req,res){
    res.render("blogs/register");
})

//sign up logic
app.post("/registerBlog",function(req, res) {
   var newUser = new User({username:req.body.username});
   User.register(newUser,req.body.password,function(err,user){
       if(err){
           req.flash("error",err.message);
           
           return res.redirect("/registerBlog");
       }
       passport.authenticate("local")(req,res,function(){
           req.flash("success","Welcome to our Blog app "+user.username);
           res.redirect("/blogs");
       });
   });
});

// login form
app.get("/loginBlog",function(req, res){
    res.render("blogs/login");
});

// login logic
app.post("/loginBlog",passport.authenticate("local",{
    successRedirect: "/blogs",
    failureRedirect: "/loginBlog",
}), function(req, res){
});

// logout logic
app.get("/logoutBlog",function(req, res){
    req.logout();
    req.flash("success","Logged you out");
    res.redirect("/blogs");
});

// ================
// Comment routes
// ================

// NEW
app.get("/blogs/:id/comments/new", middlewareBlog.isLoggedIn, function(req, res){
    // find campground by id
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            req.flash("error",err.message);
            console.log(err);
        }
        else{
                res.render("comments/new", {blog: foundBlog});
        }
    });
});

// CREATE
app.post("/blogs/:id/comments/", middlewareBlog.isLoggedIn, function(req,res){
   // lookup campground using id
   Blog.findById(req.params.id, function(err, foundBlog){
       if(err){
            req.flash("error",err.message);
           console.log(err);
           res.redirect("/blogs");
       }
       else{
           Comment.create(req.body.comment, function(err, comment){
               if(err){
                   req.flash("error",err.message);
                   console.log(err);
               }
               else{
                   comment.author.id = req.user._id;
                   comment.author.username = req.user.username;
                   comment.save();
                   foundBlog.comments.push(comment);
                   foundBlog.save(function(err){
                       if(err){
                           req.flash("error",err.message);
                           console.log(err);
                       }
                       else{
                            res.redirect("/blogs/" + foundBlog._id);         
                       }
                   });
               }
           });
       }
           
   });
});

// EDIT
app.get("/blogs/:id/comments/:comment_id/edit", middlewareBlog.checkCommentOwnership, function(req,res){
   Comment.findById(req.params.comment_id, function(err, foundComment){
       if(err){
           req.flash("error",err.message);
           console.log(err);
           res.redirect("back");
       }
       else{
           res.render("comments/edit",{blog_id:req.params.id,comment:foundComment});
       }
   });
});

// UPDATE
app.put("/blogs/:id/comments/:comment_id", middlewareBlog.checkCommentOwnership, function(req,res){
   Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err){
       if(err){
           req.flash("error",err.message);
           res.redirect("back");
       }
       else{
           res.redirect("/blogs/" + req.params.id);
       }
   }) 
});

// DELETE
app.delete("/blogs/:id/comments/:comment_id", middlewareBlog.checkCommentOwnership, function(req,res){
    Comment.findByIdAndRemove(req.params.comment_id,function(err){
        if(err){
            console.log(err);
            req.flash("error",err.message);
            res.redirect("back");
        }
        else{
            res.redirect("/blogs/"+req.params.id);
        }
    });
});


app.listen(process.env.PORT, process.env.IP, function(){
    console.log("The LetUsDream Server has Started.");
    }
);
