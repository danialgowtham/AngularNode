// Accessing the Service that we just created

var TraingCalanderService = require('../services/training_calalnder.service')
//for export
const excel = require('node-excel-export');

const mail=require('../public/javascripts/mail');

var formidable = require('formidable');


var url = require('url');


_this = this


// Async Controller function to get the Users List

exports.getTrainings = async function (req, res, next) {

    // Check the existence of the query parameters, If the exists doesn't exists assign a default value
    var training_query_data = req.query
    var condition = { $match: { $and: [{ deleted: false }] } }
    req.query.title ? condition.$match.$and.push({ 'title': { $regex: training_query_data.title } }) : '';
    req.query.nom_type ? condition.$match.$and.push({ 'nomination_type': { $regex: training_query_data.nom_type } }) : '';
    var page = req.query.page_no ? req.query.page_no : 1;
    var limit = 15;
    var isExport = training_query_data.type;
    try {

        var trainings = await TraingCalanderService.getTrainings({}, page, limit, condition, isExport)

        // Return the training list with the appropriate HTTP Status Code and Message.
        if (isExport == 'export') {
            var report = exportTraining(trainings);
            return res.status(200).attachment('report.xlsx').send(report);
        } else {
            return res.status(200).json({ status: 200, data: trainings, message: "Succesfully get training details" });
        }


    } catch (e) {

        //Return an Error Response Message with Code and the Error Message.

        return res.status(400).json({ status: 400, message: e.message });

    }
}

function exportTraining(training) {
    // console.log(training)
    training.forEach(function (value, key) {
        if(value['band'].hasOwnProperty(0)){
            training[key]['band'] = value['band'][0]['name'];
        }else{
            training[key]['band'] = '';
        }
        training[key]['unit'] = value['unit'][0]['name'];
        training[key]['venue'] = value['city'][0]['city'];
    });
    const styles = {
        headerDark: {
            font: {
                bold: true,
            }
        },
    };

    const specification = {
        title: {
            displayName: 'Title',
            headerStyle: styles.headerDark,
            width: 150
        },
        venue: {
            displayName: 'Venue',
            headerStyle: styles.headerDark,
            width: 80
        },
        date: {
            displayName: 'Date',
            headerStyle: styles.headerDark,
            width: 80
        },
        band: {
            displayName: 'Band',
            headerStyle: styles.headerDark,
            width: 50
        },
        unit: {
            displayName: 'Unit',
            headerStyle: styles.headerDark,
            width: 50
        },
        trainer_name: {
            displayName: 'Trainer Name',
            headerStyle: styles.headerDark,
            width: 150
        },
        program_detail: {
            displayName: 'Program Detail',
            headerStyle: styles.headerDark,
            width: 150
        },
        nomination_type: {
            displayName: 'Nomination Type',
            headerStyle: styles.headerDark,
            width: 100
        },
        maximum_nomination: {
            displayName: 'Maximum Nomination',
            headerStyle: styles.headerDark,
            width: 50
        },
        status: {
            displayName: 'Status',
            headerStyle: styles.headerDark,
            width: 50
        }
    }


    const report = excel.buildExport(
        [ // <- Notice that this is an array. Pass multiple sheets to create multi sheet report
            {
                name: 'Report', // <- Specify sheet name (optional)
                specification: specification, // <- Report specification
                data: training // <-- Report data
            }
        ]
    );
    return report;
}

exports.createTraining = async function (req, res, next) {

    // Req.Body contains the form submit values.

    try {
        // Calling the Service function with the new object from the Request Body

        var createtraing = await TraingCalanderService.createTraining(req.body)
        send_mail('create');
        return res.status(201).json({ status: 201, data: createtraing, message: "Succesfully Created Training" })
    } catch (e) {

        //Return an Error Response Message with Code and the Error Message.

        return res.status(400).json({ status: 400, message: "Training Creation was Unsuccesfull" })
    }
}

exports.updateTraining = async function (req, res, next) {

    // Id is necessary for the update

    if (!req.params.id) {
        return res.status(400).json({ status: 400., message: "Id must be present" })
    }



    try {
        var updatedTraining = await TraingCalanderService.updateTraining(req.params.id, req.body)
        send_mail('update');
        return res.status(200).json({ status: 200, data: updatedTraining, message: "Succesfully Updated Training" })
    } catch (e) {
        return res.status(400).json({ status: 400., message: e.message })
    }
}



exports.getTrainingById = async function (req, res, next) {
    //reading parameter from url //$_GET['id']
    // var url_parts = url.parse(req.url, true);
    // var query = url_parts.query;
    // var id = req.query.id;
    // console.log(req.params.id);
    TraingCalanderService.getTrainingById(req.params.id)
        .then(training => training ? res.json(training) : res.sendStatus(404))
        .catch(err => next(err));
}
exports.get_bands = async function (req, res, next) {
    console.log("inside band")
    TraingCalanderService.get_bands()
        .then(bands => bands ? res.json(bands) : res.sendStatus(404))
        .catch(err => next(err));
}
exports.get_units = async function (req, res, next) {
    console.log("inside unit")
    TraingCalanderService.get_units()
        .then(units => units ? res.json(units) : res.sendStatus(404))
        .catch(err => next(err));
}
exports.get_locations = async function (req, res, next) {
    console.log("inside location")
    TraingCalanderService.get_locations()
        .then(locations => locations ? res.json(locations) : res.sendStatus(404))
        .catch(err => next(err));
}

exports.upload = async function (req, res, next) {
   
    var form = new formidable.IncomingForm()
    form.parse(req);
    form.on('fileBegin', function(name, file) {
        file.path="D:\\AngularNode\\AngularNode\\mybackend\\public\\uploads"+'\\'+file.name;
    })
    form.on('field', function(name, field) {
        console.log(field);
        console.log('Got a field:', name);
    })
    form.on('error', function(err) {
        res.status(400).json({ status: 200, message: "Error While Uploading File" });
    })
    form.on('end', function() {
        res.status(200).json({ status: 200, message: "Succesfully File Recevied" });
    });
    // return res.status(200).json({ status: 200, message: "Succesfully File Recevied" })
}

function send_mail(type){
    var subject='';
    var body='';
    if(type == 'create'){
        subject="Add Training Calander";
        body="Training calander created successfully!!!";
    }else if(type== 'update'){
        subject="Update Training Calander";
        body="Training calander modified successfully!!!";

    }

    
    var mailOptions = {
        from: 'gowdham.kasi@hindujatech.com',
        to: 'gowdham.kasi@hindujatech.com',
        subject:subject,
        text: body
      };
      
      mail.transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
   
}


