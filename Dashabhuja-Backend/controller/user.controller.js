import userModel from "../models/user.model.js";

const createUser = async (req, res) => {
    const user = req.body;
    const newUser = new userModel(user);
    try {
        await newUser.save();
        res.status(201).json(newUser);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
}

const loginUser = async (req, res) => {
    const user = req.body;
    try {
        const result = await userModel.findOne({ email: user.email, password: user.password });
        if (result) {
            res.status(200).json(result);
        } else {
            res.status(409).json({ message: "Invalid email or password" });
        }   
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
}

const getUserDetails = async (req, res) => {
    const user = req.body;
    try {
        const result = await userModel.findOne({ email: user.email });
        if (result) {
            res.status(200).json(result);
        } else {
            res.status(409).json({ message: "Invalid email or password" });
        }   
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
}

const updateTrustedContacts = async (req, res) => {
    const user = req.body;
    console.log('Received Data--> ',user);
    try {
        const email= user.email;
        const trustedContactsSMS1 = user.trustedContactsSMS[0];
        const trustedContactsSMS2 = user.trustedContactsSMS[1];
        const trustedContactPhone = user.trustedContactsPhone;        
        const result = await userModel.findOneAndUpdate({ email: email }, { trustedContactsSMS: [trustedContactsSMS1, trustedContactsSMS2], trustedContactPhone: trustedContactPhone, autoSMS: user.autoSMS, autoCall: user.autoCall });
        res.status(200).json(result);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
}


export { createUser, loginUser, getUserDetails, updateTrustedContacts };