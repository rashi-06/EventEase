const mongoose = reqiure("mongoose");

const DBConnection = async() =>{
    try {
        const connection = await mongoose.connect(URL,{
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })

        console.log("connected to the db" );
        
    } catch (error) {
        console.log(error.message);
    }
}

module.exports = DBConnection; 