const express = require("express")
const cors = require("cors")
const port = 8000;
const app = express();
const bodyParser = require("body-parser");
app.use(express.json());
const fs = require("fs")
const UserDemo = require("../apiBack/models/users");
const Project = require("../apiBack/models/projectData");
const mongoose  = require("mongoose");
const { error } = require("console");
const { type } = require("os");
app.use(cors())
app.use(bodyParser.urlencoded({extended:true}))
mongoose.connect("mongodb+srv://rushivairale:hMhBAmtpe6MXrk4w@cluster0.mi0lpr7.mongodb.net/kshitijArtsDB?retryWrites=true&w=majority");

// const user = new UserDemo({
//     email :"leenavairale932@gmail.com",
//     password : "12345"
// })

// user.save();

app.post('/',async(req,res)=> {

    // const user = UserDemo.findOne({
    //     email : req.body.email
    // })
    // console.log(user.schema.obj.password)
    
    
        console.log("im in")
        await UserDemo.findOne({
            email : req.body.email
        })
        .then((user)=>{
            if(user){
                if(user.password === req.body.password){
                    res.send("valid user");
                }
                else{
                    res.send("invalid user");
                }
            }
            else{
                res.send("user does not exist");
            }
        })
        .catch((err)=>{
            console.log(err)
            res.send(err)
        })
})

app.post("/createProject",async(req,res)=>{
    console.log(req.body)
    const date = req.body.startDate
    toString(date)
    console.log(date)
    const project = new Project({
        ProjectTheme : req.body.projectTheme,
        Reason : req.body.Reason,
        Type : req.body.Type,
        Division : req.body.Division,
        Category : req.body.Category,
        Priority : req.body.Priority,
        Department : req.body.Department,
        StartDate : req.body.startDate,
        EndDate : req.body.endDate,
        ProjectLoc : req.body.projectLoc, 
        Status : "Registered"
    })

    await project.save();
    res.send("Infromation Received")
})

app.get("/getProject",async(req,res)=>{
    await Project.find()
    .then((data)=>{
        res.send(data)
    })
    .catch((err)=>{
        res.send(err)
    })
})

app.get("/sort/:sortParam",async(req,res)=>{
    let arrayData = new Array();
    const sortP = ""+req.params.sortParam
    console.log(sortP)
    await Project.find()
    .then((data)=>{
            arrayData = data
            
        arrayData.sort((a, b) => {
            var c = "";
            var d = "";
            switch (sortP) {
                case "Department":
                    console.log("first")
                    c = a.Department.toUpperCase();
                    d = b.Department.toUpperCase();
                    break;

                case "Priority":
                    c = a.Priority.toUpperCase();
                    d = b.Priority.toUpperCase();
                    break

                case "Division":
                    console.log("second")
                    c = a.Division.toUpperCase();
                    d = b.Division.toUpperCase();
                    break

                case "Category":
                    c = a.Category.toUpperCase();
                    d = b.Category.toUpperCase();
                    break

                case "Reason":
                    c = a.Reason.toUpperCase();
                    d = b.Reason.toUpperCase();
                    break

                case "Location":
                    c = a.ProjectLoc.toUpperCase();
                    d = b.ProjectLoc.toUpperCase();
                default:
                    break;
            }

  const nameA = c // ignore upper and lowercase
  const nameB = d; // ignore upper and lowercase
  if (nameA < nameB) {
    return -1;
  }
  if (nameA > nameB) {
    return 1;
  }

  // names must be equal
  return 0;
});
})
    .catch((err)=>{
        console.log(err)
    })
    res.send(arrayData)
})

app.put("/update/:id",async(req,res)=>{
    console.log(req.body)
    await Project.findOneAndUpdate({_id : req.params.id},{$set :{Status:req.body.change}})
    .then((data)=>{
        console.log(data)
        res.send(data)
    })
    .catch((err)=>{
        console.log(err)
    })
})


app.get("/dashBoardData",async(req,res)=>{

const demoArr = ["Strategy","Finance","Quality","Maintenance","Stores","HR"]
   const data = await Project.aggregate([
        {$group : {
            _id : "$Status",
            Status :{$count:{}}
        }}
    ])


    

    const date = new Date
    const dt = await Project.aggregate([
        {$match:{$and:[{Status : "Running"},{EndDate:{$lt:date}}]}},
        {$count:"Status"}
    ])
    data.push({
        "_id":"Closure",
        "Status":dt[0].Status
    })

    const obj = (await Project.find()).length
    console.log(obj)
    data.push({
        "_id" : "Total Projects",
        "Status" : obj
    });

    let ans = new Array()

    // const data = await Project.aggregate([
    //     {$group : {
    //         _id : "$Department",
    //         Status :{$count:{}}
    //     }}
    // ])

    
    await Promise.all(demoArr.map(async(item)=>{
    const dataFirst = await Project.aggregate([
        {$match:{Department:item}},
        {$count:"Status"},
        {
            $addFields :{"Department":item}
        }
        
    ])
        
        ans.push({
            name : dataFirst[0].Department,
            Total : dataFirst[0].Status,
            Closed : 0
        })
    const dataG = await Project.aggregate([
        {$match:{$and:[{Department:item},{Status:"Closed"}]}},
        {$count:"Status"},
        {
            $addFields :{"Department":item}
        }

    ])
        const i = ans.findIndex((word)=>{
            if(dataG.length !== 0){
                // console.log(data[0].Department)
                return word.name === dataG[0].Department
            }
        })
        if(i !== -1){
            ans[i].Closed = dataG[0].Status
        }
    }))
    
    res.send({
        "CountData" : data,
        "GraphData":  ans
    })
})

app.post("/getVizData",async(req, res)=>{
    console.log(req.body)
    
})

app.listen(port, (req, res) =>{
    console.log("server is running");
})

