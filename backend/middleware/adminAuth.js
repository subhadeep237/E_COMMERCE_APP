import jwt from "jsonwebtoken";

const authAdmin = (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"]; // "Bearer <token>"

    if (!authHeader) {
      return res
        .status(401)
        .json({ success: false, message: "No admin token provided" });
    }

    const parts = authHeader.split(" ");
    if (parts.length !== 2 || parts[0] !== "Bearer") {
      return res
        .status(401)
        .json({ success: false, message: "Invalid admin token format" });
    }

    const token = parts[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Our adminLogin uses: jwt.sign(email + password, JWT_SECRET)
    // so payload is a STRING for admin tokens, OBJECT ({id}) for user tokens.
    if (typeof decoded !== "string") {
      return res
        .status(403)
        .json({ success: false, message: "Not an admin token" });
    }

    req.admin = decoded;
    next();
  } catch (error) {
    console.log("Admin auth error:", error.message);
    return res
      .status(401)
      .json({ success: false, message: "Invalid or expired admin token" });
  }
};

export default authAdmin;