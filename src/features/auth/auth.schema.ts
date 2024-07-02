export const loginResponse = {
  success: {
    status: 200,
    description: 'Successfully logged in',
    schema: {
      type: 'object',
      properties: {
        code: { type: 'number', example: 200 },
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Successfully logged in' },
        token: { type: 'string', example: 'token' },
        user: {
          type: 'object',
          example: {
            active: true,
            email: 'joshuaibbotson@hotmail.com',
            name: 'josh',
            permissions: [],
            __v: 0,
            _id: '6682ed6f6a8356f1bd628d1e',
          },
        },
      },
    },
  },
  error: {
    status: 401,
    description: 'Unauthorized',
    schema: {
      type: 'object',
      properties: {
        code: { type: 'number', example: 401 },
        success: { type: 'boolean', example: false },
        message: { type: 'string', example: 'Incorrect password' },
        token: { type: 'object', nullable: true, example: null },
        user: { type: 'object', nullable: true, example: null },
      },
    },
  },
  notFound: {
    status: 404,
    description: 'Not Found',
    schema: {
      type: 'object',
      properties: {
        code: { type: 'number', example: 404 },
        success: { type: 'boolean', example: false },
        message: { type: 'string', example: 'Email does not exist' },
        token: { type: 'object', nullable: true, example: null },
      },
    },
  },
};

export const validateTokenResponse = {
  success: {
    status: 200,
    description: 'Successfully validated token',
    schema: {
      type: 'object',
      properties: {
        code: { type: 'number', example: 200 },
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Successfully validated token' },
        data: { type: 'boolean', example: true },
      },
    },
  },
  error: {
    status: 401,
    description: 'Failed validation',
    schema: {
      type: 'object',
      properties: {
        code: { type: 'number', example: 401 },
        success: { type: 'boolean', example: false },
        message: { type: 'string', example: 'invalid token' },
        data: { type: 'boolean', example: true },
      },
    },
  },
};
