import React from "react";
import { useDispatch } from "react-redux";
import { sendAdminAuthRequest } from "../../api-helpers/api-helpers";
import { adminActions } from "../../store";
import AuthForm from "../Auth/AuthForm";

const Admin = () => {
    const dispatch = useDispatch();

    // Function to handle response received from the authentication request
    const onResReceived = (data) => {
        console.log(data);
        dispatch(adminActions.login());
        localStorage.setItem("adminId", data.id);
        localStorage.setItem("token", data.token);
    };

    // Function to get data and call the sendAdminAuthRequest function
    const getData = (data) => {
        sendAdminAuthRequest(data.inputs)
            .then(onResReceived)
            .catch((err) => console.log(err));
    };

    return (
        <div>
            <AuthForm onSubmit={getData} isAdmin={true} />
        </div>
    );
};

export default Admin;
