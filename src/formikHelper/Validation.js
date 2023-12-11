import * as Yup from "yup";

export const SignupSchema = Yup.object({
    name: Yup.string().required("Name is required").min(3, "Min 3 characters required"),
    email: Yup.string().email("Invalid email format").required("Email is required"),
    country_id: Yup.number().required("Select your country"),
    state_id: Yup.number().required("Select your state"),
    password: Yup.string().required("Password is required").matches('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$', 'Must contain atleast 8 character with one uppercase and special character'),
    confirm_password: Yup.string().required("Confirm your password").oneOf([Yup.ref('password')], 'Passwords do not match')
})
export const LoginSchema = Yup.object({
    email: Yup.string().email("Invalid email format").required("Email is required"),
    password: Yup.string().required("Password is required")
})
export const CommentSchema = Yup.object({
    comment: Yup.string().required('Comment is required').max(50, 'Max 50 characters allowed')
})
export const OpenChatSchema = Yup.object({
    message: Yup.string().required('Message is required').max(50, 'Max 50 characters allowed')
})

