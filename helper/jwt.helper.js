const jwt = require("jsonwebtoken");

async function getUserFromToken(authorizationHeader, secretKey) {
  try {
    // get id user from jwt
    const { authorization } = authorizationHeader;
    const user = await jwt.verify(authorization, secretKey);
    return user;
  } catch (error) {
    console.log(error)
    throw new Error("Failed to get user from token");
  }
}

module.exports = {
  getUserFromToken,
};
