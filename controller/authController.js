import userModel from "../models/userModel.js";

export const registerController = async (req, res, next) => {
    try {
        console.log(req.body)
        const { user_name, email, password } = req.body;
        const existingUser = await userModel.findOne({
            $or: [{ user_name }, { email }],
        });

        if (existingUser) {
            if (existingUser.user_name === user_name) {
                return res.status(200).send({
                    success: false,
                    message: "Username already taken",
                });
            }

            if (existingUser.email === email) {
                return res.status(200).send({
                    success: false,
                    message: "Email already registered",
                });
            }
        }
        const newUser = new userModel(req.body);
        await newUser.save()
        const responseUser = { ...newUser.toObject() };
        delete responseUser.password;

        return res.status(201).send({
            success: true,
            message: "User Registered Successfully",
            newUser: responseUser,
        });
    } catch (error) {
        console.log(error)
        res.status(500).send({
            message: "Error In Register",
            success: false,
            error
        })
    }
}

export const loginController = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).send({
                success: false,
                message: "User not found",
            });
        }
        const passwordMatch = await user.comparePassword(password);
        if (!passwordMatch) {
            return res.status(401).send({
                success: false,
                message: "Invalid password",
            });
        }
        const responseUser = { ...user.toObject() };
        delete responseUser.password;
        return res.status(200).send({
            success: true,
            message: "Login successful",
            user: responseUser,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: "Error in Login",
            success: false,
            error,
        });
    }
};

export const uploadAvatarController = async (req, res) => {
    try {
        console.log("req.fields", req.fields);
        const { userId } = req.fields;
        const avatarSvgString = req.fields.avatar; // SVG data is in 'avatar' field of req.fields
        const user = await userModel.findById(userId);
        user.avatarImage = avatarSvgString; // Save the SVG data as a string in the 'avatarImage' field
        user.isAvatarImageSet = true;
        await user.save();

        // Sending the updated user object in the response
        res.status(200).json({ success: true, message: "Avatar image uploaded successfully", user: user });
    } catch (error) {
        console.error("Error uploading avatar image:", error);
        res.status(500).json({ success: false, message: "Failed to upload avatar image" });
    }
};

  
  export const getAvatarController = async (req, res) => {
    try {
      const { userId } = req.params;
      const user = await userModel.findById(userId);
      if (!user.isAvatarImageSet) {
        return res.status(404).json({ success: false, message: "User has not set an avatar image" });
      }
      res.set("Content-Type", user.avatarImage.contentType);
      res.send(user.avatarImage.data);
    } catch (error) {
      console.error("Error getting avatar image:", error);
      res.status(500).json({ success: false, message: "Failed to get avatar image" });
    }
  };
  export const getAllUserController = async (req, res) => {
    try {
      const excludeUserId = req.params.id; // Get the user ID from req.params.id
      const users = await userModel.find({ _id: { $ne: excludeUserId } });
      return res.status(200).send({
        success: true,
        message: "User Gets successful",
        users,
    });
    } catch (error) {
      console.error("Error getting avatar images:", error);
      res.status(500).json({ success: false, message: "Failed to get avatar images" });
    }
  };