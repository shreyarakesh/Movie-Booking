import React from "react";
import { useDispatch } from "react-redux";
import { sendUserAuthRequest } from "../../api-helpers/api-helpers";
import { userActions } from "../../store";
import AuthForm from "../Auth/AuthForm";

const Auth = () => {
    const dispatch = useDispatch();

    // Function to handle response received from the authentication request
    const onResReceived = (data) => {
        console.log(data);
        dispatch(userActions.login());
        localStorage.setItem("userId", data.id);
    };

    // Function to get data and call the sendUserAuthRequest function
    const getData = (data) => {
        sendUserAuthRequest(data.inputs, data.signup)
            .then(onResReceived)
            .catch((err) => console.log(err));
    };

    return (
        <div>
            <AuthForm onSubmit={getData} isAdmin={false} />
        </div>
    );
};

export default Auth;
