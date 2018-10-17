// Gettign the Newly created Mongoose Model we just created 
var Training = require('../models/trainings.model');
var Band = require('../models/band.model');
var Unit = require('../models/unit.model');
var CompanyLocation=require('../models/company_locations.model');



// Saving the context of this module inside the _the variable
_this = this

// Async function to get the To do List
exports.getTrainings = async function (query, page, limit, condition, isExport) {

    // Options setup for the mongoose paginate
    var options = {
        page,
        limit
    }
   
    // Try Catch the awaited promise to handle the error 

    try {
        var aggregate= Training.aggregate([
            condition,
        {
            $lookup:
            {
                from: "units",
                localField: "unit",
                foreignField: "id",
                as: "unit"
            }
        },
        {
            $lookup:
            {
                from: "bands",
                localField: "band",
                foreignField: "id",
                as: "band"
            }
        },
        {
            $lookup:
            {
                from: "company_locations",
                localField: "venue",
                foreignField: "id",
                as: "venue"
            }
        },
        {
            $lookup:
            {
                from: "cities",
                localField: "venue.city_id",
                foreignField: "id",
                as: "city"
            }
        },
        {
            $project: {
              "_id":1,
              "title":1,
              "date":1,
              "trainer_name":1,
              "program_detail":1,
              "nomination_type":1,
              "maximum_nomination":1,
              "status":1,
              "unit.name": 1,
              "city.city":1,
              "band.name": 1,

            }
        }
    ]);
    if(isExport=='export'){
        return aggregate;
    }else{
        // var trainings = await Training.paginate(query, options);
        var trainings = await Training.aggregatePaginate(aggregate,query, options);
       
        // Return the users list that was retured by the mongoose promise
        return trainings;
    }
 
        

    } catch (e) {
        console.log(e);
        // return a Error message describing the reason 
        throw Error('Error while Paginating')
    }
}
exports.createTraining = async function (trainingData) {
    console.log("training");
    const training = new Training(trainingData);
    
    console.log(training);
    // save Training
    
     await training.save();
}

exports.updateTraining = async function (training_id,trainingData) {

    console.log(training_id);
    console.log(trainingData);
    // const training = ntrainingData;
    try {
        await Training.findByIdAndUpdate(training_id,{$set:trainingData},{upsert: true} ,function(err){
            if(err){
                console.log(err);
            }
        });
    } catch (e) {
        throw Error("And Error occured while updating the User");
    }
}

exports.getTrainingById = async function (id) {
    return await Training.find({"_id":id});
    
}
exports.get_bands = async function () {
    //select id,name from bands where parent_id !="";
    //by default _id will come even thougn we didn't select 
    return await Band.find({ parent_id: { $eq: "" }}, { id: 1, name: 1,_id: 0  });
    
}
exports.get_units = async function () {
    return await Unit.aggregate([

        {
            $match: {
                "parent_id": "0"
            }
        },
        {
            $lookup:
            {
                from: "units",
                localField: "id",
                foreignField: "parent_id",
                as: "unit"
            }
        },
        {
            "$unwind": "$unit"
        },
        {
            $project: {
              "_id":0,
              "unit.id": 1,
              "unit.name": 1
            }
        }
    ]);
}
exports.get_locations = async function () {
    // return await CompanyLocation.find();
    return await CompanyLocation.aggregate([

        {
            $match: {
                "deleted": "0"
            }
        },
        {
            $lookup:
            {
                from: "cities",
                localField: "city_id",
                foreignField: "id",
                as: "city"
            }
        },
        {
            "$unwind": "$city"
        },
        {
            $project: {
              "_id":0,
              "id": 1,
              "city.city": 1,
            }
        }
    ]);
}