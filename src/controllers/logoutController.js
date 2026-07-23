export const logoutUser = async (req, res) => {
    try{
        
        const isProduction = process.env.NODE_ENV === "production";

        // Must match the attributes used when the cookie was set (utils.js),
        // otherwise browsers won't actually clear it.
        res.cookie("jwt", "", {
            maxAge: 0,
            httpOnly: true,
            sameSite: isProduction ? "none" : "lax",
            secure: isProduction,
        });
        return res.status(200).json({
            success: true,
            message: "Logout successful",
        });
    }catch (error) {
        console.log("Logout error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
}