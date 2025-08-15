/**
 * @file This file initializes and exports a singleton instance of the PrismaClient.
 * @description It serves as the central point for database connections, configuring PrismaClient with environment-specific settings like detailed logging for development environments.
 * @module database
 */

import { PrismaClient } from '@prisma/client';

// Create a new Prisma Client instance
// In development: logs all queries + info, warn, and error messages
// In production: logs only errors for performance reasons
const prisma = new PrismaClient({
    log:
        process.env.NODE_ENV === 'development'
            ? ['query', 'info', 'warn', 'error']
            : ['error'],
});

export default prisma;
