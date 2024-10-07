/**
 * This file was auto-generated by openapi-typescript.
 * Do not make direct changes to the file.
 */

export interface paths {
    "/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["AppController_getHello"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/auth/login": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Login
         * @description Login
         */
        post: operations["AuthController_login"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/auth/register": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Register
         * @description Regsiter
         */
        post: operations["AuthController_register"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/auth/@me": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get current user
         * @description Get current user
         */
        get: operations["AuthController_hydrate"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/projects": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Fetch all projects
         * @description Fetch all projects
         */
        get: operations["ProjectsController_findAll"];
        put?: never;
        /**
         * Create new project
         * @description Create new project
         */
        post: operations["ProjectsController_create"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/projects/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Find a project with id
         * @description Find a project with id
         */
        get: operations["ProjectsController_findOne"];
        put?: never;
        post?: never;
        delete: operations["ProjectsController_remove"];
        options?: never;
        head?: never;
        patch: operations["ProjectsController_update"];
        trace?: never;
    };
}
export type webhooks = Record<string, never>;
export interface components {
    schemas: {
        LoginDTO: {
            email: string;
            password: string;
        };
        UserEntity: {
            id: string;
            name: string;
            /** @description ISO8601 timestamp */
            createdAt: string;
            /** @description a decimal with precision upto 2 digits */
            walletBalance: string;
        };
        LoginSuccessfulEntity: {
            user: components["schemas"]["UserEntity"];
            /** @description JWT token */
            token: string;
        };
        GenericErrorEntity: {
            message: string;
        };
        RegisterDTO: {
            email: string;
            password: string;
            name: string;
        };
        RegisterSuccessfulEntity: {
            user: components["schemas"]["UserEntity"];
            /** @description JWT token */
            token: string;
        };
        CreateProjectDto: {
            name: string;
            description?: string;
            url?: string;
        };
        ProjectIdEntity: {
            id: string;
        };
        /** @enum {string} */
        ProjectMode: "test" | "live";
        Project: {
            id: string;
            name: string;
            description?: string;
            url?: string;
            mode: components["schemas"]["ProjectMode"];
        };
        FetchAllProjectsResponse: {
            items: components["schemas"]["Project"][];
            totalItems: number;
            /** @default 6 */
            itemsPerQuery: number;
        };
        UpdateProjectDto: {
            name?: string;
            description?: string;
            url?: string;
        };
    };
    responses: never;
    parameters: never;
    requestBodies: never;
    headers: never;
    pathItems: never;
}
export type $defs = Record<string, never>;
export interface operations {
    AppController_getHello: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Internal server error. */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["GenericErrorEntity"];
                };
            };
        };
    };
    AuthController_login: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["LoginDTO"];
            };
        };
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["LoginSuccessfulEntity"];
                };
            };
            /** @description Invalid body */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["GenericErrorEntity"];
                };
            };
            /** @description Incorrect email or password */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["GenericErrorEntity"];
                };
            };
            /** @description No user found with given email */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["GenericErrorEntity"];
                };
            };
            /** @description Internal server error. */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["GenericErrorEntity"];
                };
            };
        };
    };
    AuthController_register: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["RegisterDTO"];
            };
        };
        responses: {
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["RegisterSuccessfulEntity"];
                };
            };
            /** @description Invalid body */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["GenericErrorEntity"];
                };
            };
            /** @description Email already taken */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["GenericErrorEntity"];
                };
            };
            /** @description Internal server error. */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["GenericErrorEntity"];
                };
            };
        };
    };
    AuthController_hydrate: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["UserEntity"];
                };
            };
            /** @description No user found with given token */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["GenericErrorEntity"];
                };
            };
            /** @description Internal server error. */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["GenericErrorEntity"];
                };
            };
        };
    };
    ProjectsController_findAll: {
        parameters: {
            query: {
                /** @description The no of page */
                page: string;
                /** @description The no of items to fetch, defaults to 6 */
                limit?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["FetchAllProjectsResponse"];
                };
            };
            /** @description Internal server error. */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["GenericErrorEntity"];
                };
            };
        };
    };
    ProjectsController_create: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["CreateProjectDto"];
            };
        };
        responses: {
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProjectIdEntity"];
                };
            };
            /** @description Internal server error. */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["GenericErrorEntity"];
                };
            };
        };
    };
    ProjectsController_findOne: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description The id of the project */
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Project found */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Project"];
                };
            };
            /** @description Project not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["GenericErrorEntity"];
                };
            };
            /** @description Internal server error. */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["GenericErrorEntity"];
                };
            };
        };
    };
    ProjectsController_remove: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Internal server error. */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["GenericErrorEntity"];
                };
            };
        };
    };
    ProjectsController_update: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["UpdateProjectDto"];
            };
        };
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Internal server error. */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["GenericErrorEntity"];
                };
            };
        };
    };
}