import React, { ReactText } from "react";
import { toast } from "react-toastify";
import Toast from "../components/Layout/Toast";
import theme from "../theme";

export const makeSuccessToast = (message: string): ReactText => {
    return toast(<Toast errorMessage={message} isError={false} />, {
        autoClose: 4000,
        pauseOnHover: true,
        progressStyle: {
            background: theme.palette.primary.main,
        },
        style: {
            backgroundColor: theme.palette.secondary.main,
            color: theme.palette.secondary.contrastText,

        }
    });
};

export const makeErrorToast = (message: string, retryMethod: () => void): ReactText => {
    return toast(<Toast errorMessage={message} isError retryMethod={() => retryMethod()} />, {
        autoClose: 8000,
        pauseOnHover: true,
        progressStyle: {
            background: theme.palette.primary.main,
        },
        style: {
            backgroundColor: theme.palette.secondary.main,
            color: theme.palette.secondary.contrastText,
        }
    });
};
