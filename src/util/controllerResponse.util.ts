export interface ISuccessOptions {
  description: string;
  msgExample: string;
  data: object;
  code?: number;
}

export interface IErrorOptions {
  description: string;
  msgExample: string;
  code?: number;
}

export interface IResponseSchema {
  type: 'object';
  properties: {
    code: { type: 'number'; example: number };
    success: { type: 'boolean'; example: boolean };
    message: { type: 'string'; example: string };
    data: object;
  };
}

export interface IGeneratedResponse {
  success: {
    status: number;
    description: string;
    schema: IResponseSchema;
  };
  error: {
    status: number;
    description: string;
    schema: IResponseSchema & {
      properties: {
        code: { type: 'number'; example: number };
        success: { type: 'boolean'; example: boolean };
        message: { type: 'string'; example: string };
        data: { type: 'object'; nullable: true; example: null };
      };
    };
  };
}

export function generateResponse(
  successOpts: ISuccessOptions,
  errorOpts: IErrorOptions,
): IGeneratedResponse {
  return {
    success: {
      status: successOpts.code || 200,
      description: successOpts.description,
      schema: {
        type: 'object',
        properties: {
          code: { type: 'number', example: successOpts.code || 200 },
          success: { type: 'boolean', example: true },
          message: { type: 'string', example: successOpts.msgExample },
          data: successOpts.data,
        },
      },
    },
    error: {
      status: errorOpts.code || 500,
      description: errorOpts.description,
      schema: {
        type: 'object',
        properties: {
          code: { type: 'number', example: errorOpts.code || 500 },
          success: { type: 'boolean', example: true },
          message: { type: 'string', example: errorOpts.msgExample },
          data: {
            type: 'object',
            nullable: true,
            example: null,
          },
        },
      },
    },
  };
}
