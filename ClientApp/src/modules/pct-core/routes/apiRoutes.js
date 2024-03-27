export const apiRoutes = {
  user: `${process.env.REACT_APP_DWH_BACKEND}/api/pct-core/User`,
  userManagement: `${process.env.REACT_APP_PCT_BACKEND}/api/pct-core/user-management/User`,
  
  misendpoints: `${process.env.REACT_APP_PCT_BACKEND}`,
  // MIS ADMINISTRATION
  application: `${process.env.REACT_APP_PCT_BACKEND}/api/pct-core/system-config/Application`,
  module: `${process.env.REACT_APP_PCT_BACKEND}/api/pct-core/system-config/Module`,
  tenant: `${process.env.REACT_APP_PCT_BACKEND}/api/pct-core/Tenant`,
  //API routes for User management
  icl_user: `${process.env.REACT_APP_PCT_BACKEND}/api/pct-core/user-management/User/user-all`,
  icl_user_byid: `${process.env.REACT_APP_PCT_BACKEND}/api/pct-core/user-management/User/user-by-id`,
  icl_user_byemail: `${process.env.REACT_APP_PCT_BACKEND}/api/pct-core/user-management/User/user-by-email`,
  icl_user_create: `${process.env.REACT_APP_PCT_BACKEND}/api/pct-core/user-management/User/user-create`,
  icl_user_update: `${process.env.REACT_APP_PCT_BACKEND}/api/pct-core/user-management/User/user-update`,
  icl_user_delete: `${process.env.REACT_APP_PCT_BACKEND}/api/pct-core/user-management/User/user-delete`,

  icl_role: `${process.env.REACT_APP_PCT_BACKEND}/api/pct-core/Role/role-all`,
  icl_role_byid: `${process.env.REACT_APP_PCT_BACKEND}/api/pct-core/Role/role-by-id`,
  icl_role_byname: `${process.env.REACT_APP_PCT_BACKEND}/api/pct-core/Role/role-by-name`,
  icl_role_create: `${process.env.REACT_APP_PCT_BACKEND}/api/pct-core/Role/role-create`,
  icl_role_update: `${process.env.REACT_APP_PCT_BACKEND}/api/pct-core/Role/role-update`,
  icl_role_delete: `${process.env.REACT_APP_PCT_BACKEND}/api/pct-core/Role/role-delete`,


  icl_role_option: `${process.env.REACT_APP_PCT_BACKEND}/api/pct-core/RoleOption/roleoption-all`,
  icl_role_option_byid: `${process.env.REACT_APP_PCT_BACKEND}/api/pct-core/RoleOption/roleoption-by-id`,
  icl_role_option_byrole: `${process.env.REACT_APP_PCT_BACKEND}/api/pct-core/RoleOption/roleoption-by-role`,
  icl_role_option_byoption: `${process.env.REACT_APP_PCT_BACKEND}/api/pct-core/RoleOption/roleoption-by-option`,
  icl_role_option_create_batch: `${process.env.REACT_APP_PCT_BACKEND}/api/pct-core/RoleOption/roleoption-create-batch`,
  icl_role_option_create: `${process.env.REACT_APP_PCT_BACKEND}/api/pct-core/RoleOption/roleoption-create`,
  icl_role_option_update_batch: `${process.env.REACT_APP_PCT_BACKEND}/api/pct-core/RoleOption/roleoption-update-batch`,
  icl_role_option_update: `${process.env.REACT_APP_PCT_BACKEND}/api/pct-core/RoleOption/roleoption-update`,
  icl_role_option_delete: `${process.env.REACT_APP_PCT_BACKEND}/api/pct-core/RoleOption/roleoption-delete`,

  icl_user_role: `${process.env.REACT_APP_PCT_BACKEND}/api/pct-core/UserRole/userrole-all`,
  icl_user_role_byid: `${process.env.REACT_APP_PCT_BACKEND}/api/pct-core/UserRole/userrole-by-id`,
  icl_user_role_byuser: `${process.env.REACT_APP_PCT_BACKEND}/api/pct-core/UserRole/userrole-by-user`,
  icl_user_role_byrole: `${process.env.REACT_APP_PCT_BACKEND}/api/pct-core/UserRole/userrole-by-role`,
  icl_user_role_bycountry: `${process.env.REACT_APP_PCT_BACKEND}/api/pct-core/UserRole/userrole-by-country`,
  icl_user_role_create_batch: `${process.env.REACT_APP_PCT_BACKEND}/api/pct-core/UserRole/userrole-create-batch`,
  icl_user_role_create: `${process.env.REACT_APP_PCT_BACKEND}/api/pct-core/UserRole/userrole-create`,
  icl_user_role_update_batch: `${process.env.REACT_APP_PCT_BACKEND}/api/pct-core/UserRole/userrole-update-batch`,
  icl_user_role_update: `${process.env.REACT_APP_PCT_BACKEND}/api/pct-core/UserRole/userrole-update`,
  icl_user_role_delete: `${process.env.REACT_APP_PCT_BACKEND}/api/pct-core/UserRole/userrole-delete`,


  //Organization
  newOrganization: `${process.env.REACT_APP_PCT_BACKEND}/api/pct-core/Organization`,
  allOrganizations: `${process.env.REACT_APP_PCT_BACKEND}/api/pct-core/Organization`,
  organizationDetails: `${process.env.REACT_APP_PCT_BACKEND}/api/pct-core/Organization`,

};
