import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Field, withFormik } from 'formik';
import * as Yup from 'yup';

const NewUserForm = ({ errors, touched, values, status }) => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        if (status) {
            setUsers([...users, status]); // array to match useState above -- if there is a post submitted, set to state
        }
    }, [status]); // only fire the effect when receiving an input or "status update"

    return (
        <div className="new-user-form">
            <h1>New User Form</h1>
            <Form>
                <Field type="text" name="name" placeholder="Name" />
                {touched.name && errors.name && (
                    <p className="error">{errors.name}</p>
                )}

                <Field type="email" name="email" placeholder="Email" />
                {touched.email && errors.email && (
                    <p className="error">{errors.email}</p>
                )}

                <Field type="password" name="password" placeholder="Password" />
                {touched.password && errors.password && (
                    <p className="error">{errors.password}</p>
                )}

                <label className="checkbox-container">
                    Terms of Service
                    <Field type="checkbox" name="tos" checked={values.tos} />
                </label>

                <button type="submit">Submit!</button>
            </Form>

            {users.map(user => (
                <ul key={user.id}>
                    <li>Name: {user.name}</li>
                    <li>Email: {user.email}</li>
                    <li>Password: {user.password}</li>
                </ul>
            ))}
        </div>
    );
};

const FormikUserForm = withFormik({
    mapPropsToValues({ name, email, password, tos }) {
        return {
            name: name || "",
            email: email || "",
            password: password || "",
            tos: tos || false
        };
    },

    validationSchema: Yup.object().shape({
        name: Yup.string().required("Gimee your name, fool!"),
        email: Yup.string().required("How am I supposed to contact you, silly?"),
        password: Yup.string().required("No password, no account!")
    }),

    handleSubmit(values, { setStatus }) {
        axios
            .post('https://reqres.in/api/users', values)
            .then(res => {
                setStatus(res.data);
            })
            .catch(err => console.log(err.response))
    }
})(NewUserForm);

export default FormikUserForm;