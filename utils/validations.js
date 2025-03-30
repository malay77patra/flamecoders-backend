const { object, string } = require('yup');

const loginSchema = object({
    email: string().email("Invalid email format").required("Email is required"),
    password: string().required("Password is required").min(6, "Password must be at least 6 characters").matches(/^[a-zA-Z0-9!@#$%^&*()_+]+$/, "Password can only contain letters, numbers and special characters")
}).required();

const registerSchema = object({
    name: string().required("Name is required").min(3, "Name must be at least 3 characters"),
    email: string().email("Invalid email format").required("Email is required"),
    password: string().required("Password is required").min(6, "Password must be at least 6 characters").matches(/^[a-zA-Z0-9!@#$%^&*()_+]+$/, "Password can only contain letters, numbers and special characters")
}).required();

module.exports = {
    loginSchema,
    registerSchema
};