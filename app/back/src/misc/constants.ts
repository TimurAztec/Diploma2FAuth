export class GlobalConstants {
    public static readonly SUPER_ADMIN_ROLE: string = "super_admin";
    public static readonly ADMIN_ROLE: string = "admin";
    public static readonly MANAGER_ROLE: string = "manager";
    public static readonly EMPLOYEE_ROLE: string = "employee";
    
    public static readonly ROLES_VALUES: Map<string, number> = new Map([
        [GlobalConstants.SUPER_ADMIN_ROLE, 1],
        [GlobalConstants.ADMIN_ROLE, 2],
        [GlobalConstants.MANAGER_ROLE, 3],
        [GlobalConstants.EMPLOYEE_ROLE, 4]
    ]);
}