const pool = require("../config/db");


const getDoctors = async (req,res)=>{

    try{

        const result =
        await pool.query(
            "SELECT * FROM doctors ORDER BY id"
        );


        res.json(result.rows);


    }catch(error){

        res.status(500).json({
            error:error.message
        });

    }

};



const getDoctorById = async(req,res)=>{

    try{

        const result =
        await pool.query(
            "SELECT * FROM doctors WHERE id=$1",
            [req.params.id]
        );


        if(result.rows.length===0){

            return res.status(404).json({
                message:"Doctor not found"
            });

        }


        res.json(result.rows[0]);


    }catch(error){

        res.status(500).json({
            error:error.message
        });

    }

};



module.exports={
    getDoctors,
    getDoctorById
};