import db from "../config/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
const generateToken = (user) => {
    return jwt.sign(
        {
            id: user.id,
            username: user.username,
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "1hr",
        }
    );
};



// LOGIN
export const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        const [users] = await db.query(
            "SELECT * FROM users WHERE username = ?",
            [username]
        );

        if (users.length === 0) {
            return res.status(401).json({
                success: false,
                message: "Invalid username or password",
            });
        }

        const user = users[0];
        const isPasswordValid = await bcrypt.compare(
            password,
            user.password_hash
        );

        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
        }

        const token = generateToken(user);
        return res.status(200).json({
            success: true,
            message: "User logged in successfully",
            token,
            user: {
                id: user.id,
                username: user.username,
            },
        });

    } catch (error) {
        console.error("Login error:", error);

        return res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};


// LOGOUT
export const logout = async (req, res) => {
    
    return res.status(200).json({
        success: true,
        message: "User logged out successfully",
    });
};

