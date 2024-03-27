import React from "react";
import {
    geticl_options_route,
    geticl_options_route_byid,
    geticl_options_route_userid,
    newicl_options_route,
    updateicl_options_route,
    deleteicl_options_route,
} from "../../apis/icl_options_route";

import { useMutation, useQuery } from "@tanstack/react-query";

export const getPermissionsForUser = async (user) => {
    if (!user || !user.idTokenClaims) {
        return [];
    }
    const userId = user.idTokenClaims.oid;
    try {
        const existingRoutes = await geticl_options_route_userid(userId);

        if (!existingRoutes || !existingRoutes.data) {
            return [];
        }
        return existingRoutes.data;
    } catch (error) {
        console.error("An error occurred on getPermissionsForUser:", error.message," Name:",error.name," Code: ",error.code);
        return [];       
    }
};


