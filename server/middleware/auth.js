// import jwt from "jsonwebtoken";

// const auth = (roles = []) => {
//   return async (req, res, next) => {
//     try {
//       const token = req.headers.authorization?.split(" ")[1];
//       if (!token) {
//         return res.status(401).json({ message: "No token provided" });
//       }

//       const decoded = jwt.verify(token, process.env.JWT_SECRET);
//       req.user = decoded;

//       if (roles.length && !roles.includes(decoded.role)) {
//         return res.status(403).json({ message: "Access denied" });
//       }

//       next();
//     } catch (error) {
//       res.status(401).json({ message: "Invalid token" });
//     }
//   };
// };

// export default auth;
import jwt from "jsonwebtoken";

const auth = (roles = []) => {
  return (req, res, next) => {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      return res.status(401).json({ message: "No token, authorization denied" });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (roles.length && !roles.includes(decoded.role)) {
        return res.status(403).json({ message: "Access denied" });
      }
      req.user = decoded; // { id, role }
      next();
    } catch (error) {
      console.error("Token verification error:", error);
      res.status(401).json({ message: "Invalid token" });
    }
  };
};

export default auth;