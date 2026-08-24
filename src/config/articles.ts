import type { ArticleCardProps } from '@/components/article-card';
import { socialLinks } from '@/config/social';

export const articles: ArticleCardProps[] = [
  {
    slug: 'nestjs-request-lifecycle',
    title: 'NESTJS REQUEST LIFECYCLE: WHO DOES WHAT?',
    description:
      'A deep architectural breakdown of how requests traverse Middleware, Guards, Interceptors, Pipes, and Exception Filters in NestJS.',
    coverImage: undefined,
    linkedinHref: socialLinks[1]?.href,
    telegramHref: socialLinks[2]?.href,
    readHref: '/articles/nestjs-request-lifecycle',
    subtitle:
      'Understanding execution order and responsibilities to keep backend controllers slim, predictable, and maintainable.',
    date: '2026-08',
    readTime: '6 MIN READ',
    category: 'BACKEND // NESTJS',
    content: `
## Overview

In NestJS, incoming HTTP requests don't hit controllers directly. They pass through a strictly defined pipeline of architectural layers. Misplacing logic — such as validating DTOs in middleware or checking permissions inside controllers — leads to code duplication, testing headaches, and subtle security gaps.

---

## The Execution Sequence

Each layer has a single, well-defined responsibility. When a client initiates a request, the runtime processes it in this exact order:

1. **Global & Route Middleware**: Executes raw request handlers (CORS, body parsing, request IDs, low-level logging).
2. **Guards**: Determines whether the caller has permission to access the route before any business logic runs.
3. **Pre-Controller Interceptors**: Binds extra logic before route execution (e.g. starting execution timers, cache checks).
4. **Pipes**: Validates payload schemas and transforms raw JSON into typed DTO instances.
5. **Controller Handler**: The business entrypoint that delegates work to injectable providers/services.
6. **Post-Controller Interceptors**: Mutates returned response bodies, transforms RxJS streams, or logs response status codes.
7. **Exception Filters**: Traps unhandled errors thrown anywhere in the lifecycle and formats standard client-facing JSON errors.

---

## Practical Example: Auth Guard & Validation Pipe

Guards should never transform input data. Their only job is to evaluate context and return a boolean or throw an \`UnauthorizedException\`:

\`\`\`typescript
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class AccessTokenGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing or invalid bearer token');
    }

    const token = authHeader.split(' ')[1];
    // Attach decoded identity payload directly to the request object
    request['user'] = await this.verifyToken(token);
    return true;
  }

  private async verifyToken(token: string) {
    // Decryption / verification logic
    return { id: 'usr_01', role: 'ENGINEER' };
  }
}
\`\`\`

---

## Layer Responsibilities Summary

| Layer | Primary Responsibility | Common Anti-Pattern |
| :--- | :--- | :--- |
| **Middleware** | Low-level HTTP headers & parsing | Domain data validation |
| **Guards** | Authentication & RBAC permissions | Mutating request bodies |
| **Pipes** | Schema validation & type casting | Database lookups |
| **Interceptors** | Performance profiling & caching | Permission authorization |
| **Filters** | Standardized error formatting | Handling business logic |

---

## Architectural Rules of Thumb

* **Use Pipes strictly for schema integrity**: If a payload fails schema validation, execution must stop before hitting your controller methods.
* **Keep Controllers thin**: Controllers should only parse parameters, call services, and return results.
* **Centralize error handling with Filters**: Never wrap every controller method in \`try/catch\` blocks; let NestJS filters produce uniform error envelopes.

> Explicit layer boundaries reduce regression risks and make unit testing isolated and predictable.
    `,
  },
  {
    slug: 'react-state-architecture',
    title: 'PREDICTABLE STATE FLOW IN COMPLEX REACT UIs',
    description:
      'Architectural principles for managing global data flow, background cache invalidation, and local interactive UI state without overhead.',
    coverImage: undefined,
    linkedinHref: socialLinks[1]?.href,
    telegramHref: socialLinks[2]?.href,
    readHref: '/articles/react-state-architecture',
    subtitle:
      'Eliminating state synchronization issues by separating server data cache from interactive client state.',
    date: '2026-07',
    readTime: '8 MIN READ',
    category: 'FRONTEND // REACT',
    content: `
## The Problem with Monolithic State

Treating server data and client interaction state as a single unified store causes state drift, stale data bugs, and excessive component re-renders.

### Three Categories of State

1. **Server State**: Asynchronous, cached, and owned by remote APIs (e.g. user profiles, case metrics).
2. **Client Interaction State**: Ephemeral UI toggles, active tabs, modal visibility, and local form inputs.
3. **URL State**: The single source of truth for routing, filters, search parameters, and pagination.

\`\`\`typescript
// Separate interactive UI state from cached entity records
interface WorkspaceUiState {
  sidebarOpen: boolean;
  activeFilter: string;
  selectedElementId: string | null;
}
\`\`\`

> If state can be derived or stored in the URL search parameters, avoid duplicating it in React context or global stores.
    `,
  },
];