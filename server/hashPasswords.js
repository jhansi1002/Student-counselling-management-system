import bcrypt from "bcryptjs";

const passwords = ["student123", "faculty123", "admin123"];
passwords.forEach((password) => {
  bcrypt.hash(password, 10, (err, hash) => {
    if (err) console.error(err);
    console.log(`Password: ${password}, Hash: ${hash}`);
  });
});