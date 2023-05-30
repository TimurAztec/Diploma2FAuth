export namespace GlobalConstants {
    export class Roles {
        public static readonly DEFAULT_ROLE: string = "default";
    }
    
    export class Permissions {
        public static readonly READ_SCHEDULE: string = "read_schedule";
        public static readonly READ_STAFF: string = "read_staff";
        public static readonly READ_ROLES: string = "read_roles";
        public static readonly READ_INVENTORY: string = "read_inventory";
        public static readonly READ_CLIENTS: string = "read_clients";
        public static readonly EDIT_SCHEDULE: string = "edit_schedule";
        public static readonly EDIT_STAFF: string = "edit_staff";
        public static readonly EDIT_ROLES: string = "edit_roles";
        public static readonly CREATE_ROLES: string = "create_roles";
        public static readonly EDIT_INVENTORY: string = "edit_inventory";
        public static readonly EDIT_CLIENTS: string = "edit_clients";
        public static readonly DELETE_SCHEDULE: string = "delete_schedule";
        public static readonly DELETE_STAFF: string = "delete_staff";
        public static readonly DELETE_ROLES: string = "delete_roles";
        public static readonly DELETE_INVENTORY: string = "delete_inventory";
        public static readonly DELETE_CLIENTS: string = "delete_clients";
    }
}