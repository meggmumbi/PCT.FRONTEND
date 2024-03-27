import React from "react";
import {
    geticl_user,
    geticl_user_byid,
    geticl_user_byemail,
    newicl_user,
    updateicl_user,
    deleteicl_user,
} from "../../apis/icl_user";
import { checkPermission, checkPermissionByName, checkPermissionRoutes, getAllSites, getPermissionByUser } from "../../apis/mis-endpoints";
import { geticl_role_byname, newicl_role, } from "../../apis/icl_role";
import { geticl_country_byname, newicl_country } from "../../apis/icl_country";
import {
    geticl_user_role,
    geticl_user_role_byid,
    geticl_user_role_byuser,
    geticl_user_role_byrole,
    geticl_user_role_bycountry,
    newicl_user_role_batch,
    newicl_user_role,
    updateicl_user_role_batch,
    updateicl_user_role,
    deleteicl_user_role,
} from "../../apis/icl_user_role";
import { geticl_options_route } from "../../apis/icl_options_route";
import { newicl_role_option_batch } from "../../apis/icl_role_option";
import { getCMSContentLeadership } from "../../apis/cmscontent-leadership";
import { getCMSContentImpact } from "../../apis/cmscontent-impact";
import { newCMSContentRoles } from "../../apis/cmscontent-roles";
import { useMutation, useQuery } from "@tanstack/react-query";

export const userUpdateInfo = async (user) => {
    if (!user || !user.idTokenClaims) {
        return;
    }
    try {
        return await checkUserExistence(user);
        //const guestRole = await checkRoleExistence([{ name: "Guest" }]);
        //const usCountry = await checkCountryExistence([{ name: "United States", code: "US" }]);
        //await updateUserRoles(userId, guestRole, usCountry);        
    } catch (error) {
        console.error("An error occurred on userUpdateInfo:", error.message, " Name:", error.name, " Code: ", error.code);
    }

};

export const checkUserPermissionByCode = async (permissionCode, user, site) => {
    if (permissionCode && user && site) {
        try {
            const result = await checkPermission({ queryKey: ['checkPermission', permissionCode, user.username, site.id] });
            if (result && result.data)
                return true;
        } catch (error) {
            console.error("An error occurred on check permission:", error.message, " Name:", error.name, " Code: ", error.code);
        }
    }
    return false;
};
export const checkUserPermissionByName = async (permissionName, user, site) => {
    if (permissionName && user && site) {
        try {
            const result = await checkPermissionByName({ queryKey: ['checkPermission', permissionName, user.username, site.id] });
            if (result && result.data)
                return true;
        } catch (error) {
            console.error("An error occurred on check permission:", error.message, " Name:", error.name, " Code: ", error.code);
        }
    }
    return false;
};

export const checkRoutesPermission = async (routes, user, site) => {
    if (user && site) {
        try {
            const result = await checkPermissionRoutes({ queryKey: ['checkPermission', user.username, site.id] });
            if (result && result.data) {
                //start filtering
                const filteredRoutes = routes.map((route) => {
                    const sanitizedPath = route.path.replace(/\//g, "");

                    if (sanitizedPath === "/" || sanitizedPath === "auth") {
                        return route;
                    }

                    if (!result.data.some((permission) => permission.route.replace(/\//g, "") === sanitizedPath) && sanitizedPath !== '') {
                        return { ...route, disabled: true };
                    }

                    if (route.children && route.children.length > 0) {
                        const filteredChildren = route.children.map((child) => {
                            const sanitizedChildPath = child.path.replace(/\//g, "");

                            if (!result.data.some((permission) => (permission.route.includes(sanitizedPath) && permission.route.includes(sanitizedChildPath))) && !(sanitizedChildPath == "")) {
                                return { ...child, disabled: true };
                            }
                            return child;
                        }).filter(child => !child.disabled);

                        return { ...route, children: filteredChildren };
                    }

                    return route;
                }).filter(route => !route.disabled);
                //end filtering
                return filteredRoutes;
            }

        } catch (error) {
            console.error("An error occurred on check permission:", error.message, " Name:", error.name, " Code: ", error.code);
        }
    }
    return routes.filter(route => { return route.path === "/" || route.path === "auth"; });
};

export const checkRoutesPermissionV2 = async (routes, user, site) => {
    let siteId = '00000000-0000-0000-0000-000000000000';
    if (site) {
        siteId = site.id;
    } else {
        const response = await getAllSites({ queryKey: ['getAllSitesList'] });
        siteId = response.data && response.data.length >= 1 ? response.data[0].id : '00000000-0000-0000-0000-000000000000';
    }

    if (user) {
        try {
            const result = await getPermissionByUser({ queryKey: ['getPermissions', user.username, siteId] });
            if (result && result.data) {
                //start filtering
                const filteredRoutes = routes.map((route) => {
                    if (route.path === "/" || route.path === "auth") {
                        return route;
                    }

                    const hasPermission = route.permission ? result.data.some(permission => route.permission.includes(permission.name)) : false;

                    if (hasPermission) {

                        if (route.children && route.children.length > 0) {

                            const filteredChildren = route.children.map((child) => {
                                const childHasPermission = child.permission ? result.data.some(permission => child.permission.includes(permission.name)) : false;

                                if (childHasPermission) {
                                    return child;
                                } else {
                                    return { ...child, disabled: true };
                                }
                            }).filter(child => !child.disabled);

                            if (filteredChildren.length > 0) {
                                return { ...route, children: filteredChildren };
                            }
                            route.childern = filteredChildren
                        }

                        return route;
                    }

                    if (route.children && route.children.length > 0) {

                        const filteredChildren = route.children.map((child) => {
                            const childHasPermission = child.permission ? result.data.some(permission => child.permission.includes(permission.name)) : false;

                            if (childHasPermission) {
                                return child;
                            } else {
                                return { ...child, disabled: true };
                            }
                        }).filter(child => !child.disabled);

                        if (filteredChildren.length > 0) {
                            return { ...route, children: filteredChildren };
                        }
                    }

                    return { ...route, disabled: true };
                }).filter(route => !route.disabled);
                //end filtering
                return filteredRoutes;
                //return routes;
            }

        } catch (error) {
            console.error("An error occurred on check permission:", error.message, " Name:", error.name, " Code: ", error.code);
        }
    }
    return routes.filter(route => { return route.path === "/" || route.path === "auth"; });
};

const checkUserExistence = async (user) => {
    const userEmail = user.username;
    try {
        const existingUser = await geticl_user_byemail(userEmail);

        if (!existingUser || !existingUser.data) {
            console.log('user---data', existingUser.data);
            return await createUser(user);
        } else {
            return existingUser.data;
        }
    } catch (error) {
        console.error("An error occurred on checkUserExistence:", error.message, " Name:", error.name, " Code: ", error.code);
    }
};

const checkRoleExistence = async (roles) => {
    const updatedRoles = [];

    for (let i = 0; i < roles.length; i++) {
        const roleName = roles[i].name;
        const existingRole = await geticl_role_byname(roleName);

        if (!existingRole || !existingRole.data) {
            const createdRole = await createRole(roleName);
            addRoleToContent(createdRole)
            updatedRoles.push(createdRole.data);

            //Added: if the role is new, add all permissions
            //comment/remove if not needed:
            try {
                const optionsRouteData = await geticl_options_route();

                if (optionsRouteData) {
                    const updatedOptionsRoutes = optionsRouteData.data
                        .filter((route) => !route.isDeleted)
                        .map((route) => ({
                            ...route,
                            optionid: route.id,
                            id: null,
                            readpermission: true,
                            writepermission: true,
                            updatepermission: true,
                            roleid: createdRole.data.id,
                        }));

                    const selectedOptionsNew = updatedOptionsRoutes
                        .filter((option) => option.id === null)
                        .map(({ id, ...rest }) => ({
                            optionid: rest.optionid,
                            readpermission: rest.readpermission,
                            writepermission: rest.writepermission,
                            updatepermission: rest.updatepermission,
                            roleid: rest.roleid,
                        }));

                    if (selectedOptionsNew.length > 0) {
                        await newicl_role_option_batch(selectedOptionsNew);
                    }
                }
            } catch (error) {
                console.error("An error occurred:", error);
            }
            //end of block to add all permissions to new roles

        } else {
            updatedRoles.push(existingRole.data);
        }
    }

    return updatedRoles;
};

const checkCountryExistence = async (countries) => {
    const updatedCountries = [];

    for (let i = 0; i < countries.length; i++) {
        const country = countries[i];
        const countryName = country.name;
        const countryCode = country.code;
        const existingCountry = await geticl_country_byname(countryName);

        if (!existingCountry || !existingCountry.data) {
            const createdCountry = await createCountry(countryName, countryCode);
            updatedCountries.push(createdCountry.data);
        } else {
            updatedCountries.push(existingCountry.data);
        }
    }

    return updatedCountries;
};


const createUser = async (user) => {
    const newUser = {
        id: user.idTokenClaims.oid,
        fullName: user.name,
        email: user.username,
        firstName: null,
        lastName: null,
        otherNames: null,
        organisation: null,
        phone: null,
        userRoles: []
    };

    const result = await newicl_user(newUser);
    if (result && result.data)
        return result.data
};
const createRole = async (roleName) => {
    const newRole = {
        Category: "Imported",
        Name: roleName,
    };

    return await newicl_role(newRole);
};
const createCountry = async (countryName, countryCode) => {
    const newCountry = {
        Name: countryName,
        Code: countryCode,
    };

    return await newicl_country(newCountry);
};

const updateUserRoles = async (userId, roles, countries) => {
    const existingUserRoles = await geticl_user_role_byuser(userId);
    if (existingUserRoles && existingUserRoles.data) {
        const existingRoles = existingUserRoles.data.map((userRole) => ({ roleId: userRole.roleId, countryId: userRole.countryId, }));
        const newFoundRoles = roles.map((userRole) => userRole.id);
        const newFoundCountries = countries.map((userCountry) => userCountry.id);

        const newRoles = [];
        newFoundRoles.forEach(newRoleId => {
            if (!existingRoles.some(roleObj => roleObj.roleId === newRoleId)) {
                newFoundCountries.forEach(newCountryId => {
                    if (!existingRoles.some(roleObj => roleObj.countryId === newCountryId)) {
                        newRoles.push({ roleId: newRoleId, countryId: newCountryId });
                    }
                });
            }
        });

        if (newRoles.length > 0) {
            const newRolesData = newRoles.map((role) => ({
                userid: userId,
                roleid: role.roleId,
                countryid: role.countryId,
                enabled: true
            }));
            await newicl_user_role_batch(newRolesData);
        }
    }
};

//add access to content to new role
const addRoleToContent = async (role) => {
    try {
        const contentImpactData = await getCMSContentImpact();// contentType 1
        const contentLeadershipData = await getCMSContentLeadership();// contentType 2

        const contentAssignation = [];
        if (contentImpactData && contentImpactData.data) {
            contentImpactData.data.forEach(item => {
                const contentId = item.id;
                contentAssignation.push({ "Id_roles": role.data.id, "Id_content": contentId, "Type": "1", "Status": true });
            });
        }
        if (contentLeadershipData && contentLeadershipData.data) {
            contentLeadershipData.data.forEach(item => {
                const contentId = item.id;
                contentAssignation.push({ "Id_roles": role.data.id, "Id_content": contentId, "Type": "2", "Status": true });
            });
        }
        for (const item of contentAssignation) {
            await newCMSContentRoles(item);
        }

    } catch (error) {
        console.error("An error occurred:", error.message, " Name:", error.name, " Code: ", error.code);
    }

};
