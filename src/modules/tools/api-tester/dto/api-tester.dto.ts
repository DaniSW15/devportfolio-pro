import { ApiProperty } from "@nestjs/swagger";
import { BodyType, HttpMethod } from "../interfaces/http-method.interface";
import { IsArray, IsEnum, IsNotEmpty, IsOptional, IsString, IsUrl } from "class-validator";

export class HttpRequestDto {
    @ApiProperty({ example: 'Content-Type' })
    key!: string;

    @ApiProperty({ example: 'application/json' })
    value!: string;
}

export class GraphQLQueryDto {
    @ApiProperty({ example: 'query { user(id: "1") { name } }' })
    query!: string;

    @ApiProperty({ required: false, example: 'query GetUser($id: ID!) { user(id: $id) { name } }' })
    variables?: Record<string, any>;

    @ApiProperty({ required: false })
    operationName?: string;
}

export class ApiTesterDto {
    @ApiProperty({ enum: HttpMethod, example: HttpMethod.GET })
    @IsEnum(HttpMethod)
    method!: HttpMethod;

    @ApiProperty({ example: 'https://api.example.com/users' })
    @IsUrl()
    @IsNotEmpty()
    url!: string;

    @ApiProperty({ type: [HttpRequestDto], required: false })
    @IsOptional()
    @IsArray()
    headers?: HttpRequestDto[];

    @ApiProperty({ enum: BodyType, default: BodyType.NONE })
    @IsEnum(BodyType)
    @IsOptional()
    bodyType?: BodyType = BodyType.NONE;

    @ApiProperty({ required: false })
    @IsOptional()
    body?: string;

    @ApiProperty({ type: GraphQLQueryDto, required: false })
    @IsOptional()
    graphql?: GraphQLQueryDto;

    @ApiProperty({ description: 'Request timeout in milliseconds', default: 3000, required: false })
    @IsOptional()
    timeout?: number = 3000;
}

export class ApiTesterResponseDto {
    @ApiProperty()
    success!: boolean;

    @ApiProperty()
    status!: number;

    @ApiProperty()
    statusText!: string;

    @ApiProperty()
    headers!: Record<string, string>;

    @ApiProperty()
    data!: any;

    @ApiProperty()
    size!: number;

    @ApiProperty()
    time!: number;

    @ApiProperty({ required: false })
    error?: string;

    @ApiProperty()
    timestamp!: string;
}

export class SaveRequestDto {
    @ApiProperty()
    @IsString()
    name!: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty()
    @IsArray()
    tags?: string[];

    @ApiProperty({ type: ApiTesterDto })
    request!: ApiTesterDto;
}

export class CollectionDto {
    @ApiProperty()
    id?: string;

    @ApiProperty()
    @IsString()
    name!: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty({ type: [SaveRequestDto] })
    requests!: SaveRequestDto[];
}