export enum HttpMethod {
    GET = 'GET',
    POST = 'POST',
    PUT = 'PUT',
    DELETE = 'DELETE',
    PATCH = 'PATCH',
    HEAD = 'HEAD',
    OPTIONS = 'OPTIONS'
}

export enum BodyType {
    JSON = 'JSON',
    FORM_DATA = 'FORM_DATA',
    X_WWW_FORM_URLENCODED = 'X_WWW_FORM_URLENCODED',
    TEXT = 'TEXT',
    GRAPHQL = 'GRAPHQL',
    NONE = 'NONE'
}