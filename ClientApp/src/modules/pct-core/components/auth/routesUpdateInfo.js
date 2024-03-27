import React from "react";
import {geticl_options_route,newicl_options_route_batch} from "../../apis/icl_options_route";
import {getPermissions, newPermission_batch} from "../../apis/mis-endpoints";
import { useMutation, useQuery } from "@tanstack/react-query";

export const routesUpdateInfo = async (routes) => {   
    if (!routes) {
        return;
    }
    try {
        //const existingRoutes = await geticl_options_route();
        //const updatedRoutes = await updateExistingRoutes(existingRoutes, routes);
        const existingPermissions = await getPermissions({ queryKey: ['getPermissions'] });
        const applicationPermissions = getPermissionsFromRoutes(routes);
        const updatedPermissions = await updateExistingPermissions(existingPermissions, applicationPermissions);
    } catch (error) {
        console.error("An error occurred on routesUpdateInfo:", error.message," Name:",error.name," Code: ",error.code);
    }

};

const updateExistingRoutes = async (existingDBRoutes, actualRoutes) => {
    if (existingDBRoutes && existingDBRoutes.data) {
        let transformedRoutes = actualRoutes.reduce((acc, route) => {
            if (route.path && route.path.trim() !== "" && route.path !== "auth" && route.path !== "*") {
                acc.push({ category: route.path, route: route.path, permission: route.permission });
                if (route.children && route.children.length > 0) {
                    route.children.forEach(child => {
                        if (child.path && child.path.trim() !== "" && child.path !== "auth" && child.path !== "*") {
                            let concatenatedPath = route.path;
                            if (!route.path.endsWith('/') && !child.path.startsWith('/')) {
                                concatenatedPath += '/';
                            }
                            concatenatedPath += child.path;
                            acc.push({ category: route.path, route: concatenatedPath, permission: route.permission });
                        }
                    });
                }
            }
            return acc;
        }, []);
        transformedRoutes = transformedRoutes.map((optionRoute) => {
              const existingRouteMatch = existingDBRoutes.data.find((existingRoute) => existingRoute.route === optionRoute.route);
              if (existingRouteMatch) {
                return {...optionRoute,id: existingRouteMatch.id,};
              }
              return optionRoute;
        });
        const newRoute = transformedRoutes.filter((optionRoute) => !optionRoute.id);

        if (newRoute && newRoute.length > 0) {
            const newRouteData = newRoute.map((optionRoute) => ({
                category: optionRoute.category,
                name: "",
                route: optionRoute.route                
            }));
            const newRoutesCreated = await newicl_options_route_batch(newRouteData);

            if (newRoutesCreated && newRoutesCreated.data) {
                transformedRoutes = transformedRoutes.map((optionRoute) => {
                      const existingRouteMatch = newRoutesCreated.data.find((existingRoute) => existingRoute.route === optionRoute.route);
                      if (existingRouteMatch) {
                        return {...optionRoute,id: existingRouteMatch.id,};
                      }
                      return optionRoute;
                });
            }
        }
        return transformedRoutes;
    }
};

function getPermissionsFromRoutes(routes) {
  let permissions = [];

  routes.forEach(route => {
      if (route.permission) {
          route.permission.forEach(permission => {
            permissions.push({ name: permission });
          });
      }

    if (route.children) {
      const childPermissions = getPermissionsFromRoutes(route.children);
      permissions = [...permissions, ...childPermissions];
    }
  });
  return permissions; 
}

const updateExistingPermissions = async (existingDBPermissions, appPermissions) => {
    const applicationPermissions = Array.from(new Set(appPermissions.map(item => item.name))).map(name => ({ name }))
    if (existingDBPermissions && existingDBPermissions.data) {
        let transformedPermissions = applicationPermissions.map((optionPermission) => {
              const existingPermissionMatch = existingDBPermissions.data.find((existingPermission) => existingPermission.name === optionPermission.name);
              if (existingPermissionMatch) {
                return {...optionPermission,id: existingPermissionMatch.id,};
              }
              return optionPermission;
        });
        const newPermissions = transformedPermissions.filter((optionPermission) => !optionPermission.id);

        if (newPermissions && newPermissions.length > 0) {
            const newPermissionsData = newPermissions.map((optionPermission) => ({
                name: optionPermission.name,
                code: ""
            }));
            const newPermissionCreated = await newPermission_batch(newPermissionsData);

            if (newPermissionCreated && newPermissionCreated.data) {
                transformedPermissions = transformedPermissions.map((optionPermission) => {
                      const existingPermissionMatch = newPermissionCreated.data.find((existingPermission) => existingPermission.name === optionPermission.name);
                      if (existingPermissionMatch) {
                        return {...optionPermission,id: existingPermissionMatch.id,};
                      }
                      return optionPermission;
                });
            }
        }
        return transformedPermissions;
    }
};
