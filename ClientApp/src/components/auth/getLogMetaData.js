import React from "react";

export const getLogMetaData = async (axios) => {
    try {
        const userNameElement = document.getElementById("user-username-footer");
        const userIDElement = document.getElementById("user-id-footer");
        const userIPElement = document.getElementById("user-ip-footer");
        const userLocationElement = document.getElementById("user-location-sidebarnav");

        if (userNameElement)
            axios.defaults.headers.common['log_user'] = userNameElement.textContent;            
        if (userIDElement)
            axios.defaults.headers.common['log_user_id'] = userIDElement.textContent;
        if (userIPElement)
            axios.defaults.headers.common['log_ip'] = userIPElement.textContent;
        if (userLocationElement)
            axios.defaults.headers.common['log_route'] = userLocationElement.textContent;

    } catch (error) {
        console.error("An error occurred:", error);
    }
};