export interface IZammadAuthResponse {
    access_token: string,
    refresh_token: string,
    token_type: string,
    expires_in: number,
    created_at: string
}

export interface IZammadContact {
    id?: number,
    organization_id?: number,
    login?: string,
    firstname?: string | null,
    lastname: string | null,
    email?: string,
    image?: string,
    image_source?: string | null,
    web?: string,
    phone?: string,
    fax?: string,
    mobile?: string,
    department?: string,
    street?: string,
    zip?: string,
    city?: string,
    country?: string,
    address?: string,
    vip?: boolean,
    verified?: boolean,
    active?: boolean,
    note?: string,
    last_login?: string | null,
    source?: string | null,
    login_failed?: number,
    out_of_office?: boolean,
    out_of_office_start_at?: string,
    out_of_office_end_at?: string,
    out_of_office_replacement_id?: string,
    preferences?: any,
    updated_by_id?: number,
    created_by_id?: number,
    created_at?: string,
    updated_at?: string,
    role_ids?: any[],
    organization_ids?:  number[],
    authorization_ids?: number[],
    group_ids?: any
}

export interface IZammadContactsResponse {
    data: IZammadContact[]
}

export interface IZammadContactResponse {
    data: IZammadContact
}

export interface IZammadUpdateResponse {
    code: number,
    data?: { type: string, id: string },
}

export enum RequestMethods {
    GET = 'get',
    POST = 'post',
    PUT = 'put',
    DELETE = 'delete',
}

export interface IRequest {
    url: string,
    method: RequestMethods,
    baseURL?: string,
    headers?: { [ key: string ]: any }
    params?: { [ key: string ]: any }
}
