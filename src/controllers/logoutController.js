export const logoutUser = async (req, res) => {
    try{
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