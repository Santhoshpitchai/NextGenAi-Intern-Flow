import type { NextFunction, Request, Response } from "express";
import { UserRole } from "@prisma/client";
import { ApiError } from "../utils/ApiError.js";

/**
 * Feature-level permissions for RBAC
 * Define what features each role can access
 */
export const PERMISSIONS = {
  // Admin-only features
  MANAGE_COMPANY: [UserRole.COMPANY_ADMIN, UserRole.SUPER_ADMIN],
  MANAGE_ASSIGNMENTS: [UserRole.COMPANY_ADMIN, UserRole.SUPER_ADMIN],
  MANAGE_TASKS: [UserRole.COMPANY_ADMIN, UserRole.SUPER_ADMIN],
  VIEW_ALL_INTERNS: [UserRole.COMPANY_ADMIN, UserRole.SUPER_ADMIN],
  CREATE_INTERN_ASSIGNMENT: [UserRole.COMPANY_ADMIN, UserRole.SUPER_ADMIN],
  DELETE_USERS: [UserRole.SUPER_ADMIN],
  
  // Intern-only features
  VIEW_OWN_PROFILE: [UserRole.INTERN],
  UPDATE_OWN_PROFILE: [UserRole.INTERN],
  UPLOAD_RESUME: [UserRole.INTERN],
  UPLOAD_PROFILE_PHOTO: [UserRole.INTERN],
  VIEW_OWN_ASSIGNMENTS: [UserRole.INTERN],
  VIEW_OWN_TASKS: [UserRole.INTERN],
  UPDATE_TASK_PROGRESS: [UserRole.INTERN],
  VIEW_OWN_NOTIFICATIONS: [UserRole.INTERN],
  
  // Shared features
  VIEW_PROFILE: [UserRole.INTERN, UserRole.COMPANY_ADMIN, UserRole.SUPER_ADMIN],
  VIEW_NOTIFICATIONS: [UserRole.INTERN, UserRole.COMPANY_ADMIN, UserRole.SUPER_ADMIN],
} as const;

export type Permission = keyof typeof PERMISSIONS;

/**
 * Middleware to check if user has required permission
 */
export function requirePermission(permission: Permission) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(ApiError.unauthorized("Authentication required"));
    }

    const allowedRoles = PERMISSIONS[permission];
    
    if (!(allowedRoles as readonly UserRole[]).includes(req.user.role)) {
      return next(
        ApiError.forbidden(
          `Access denied. This feature is not available for your role.`
        )
      );
    }

    next();
  };
}

/**
 * Middleware to check if user can access a specific resource
 * For example, interns can only access their own data
 */
export function requireResourceOwnership(resourceUserIdGetter: (req: Request) => string) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(ApiError.unauthorized("Authentication required"));
    }

    // Admins can access any resource
    if (
      req.user.role === UserRole.COMPANY_ADMIN ||
      req.user.role === UserRole.SUPER_ADMIN
    ) {
      return next();
    }

    // For interns, check if they own the resource
    const resourceUserId = resourceUserIdGetter(req);
    
    if (req.user.id !== resourceUserId) {
      return next(
        ApiError.forbidden("You can only access your own resources")
      );
    }

    next();
  };
}

/**
 * Check if user has any of the specified permissions
 */
export function requireAnyPermission(...permissions: Permission[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(ApiError.unauthorized("Authentication required"));
    }

    const hasPermission = permissions.some((permission) => {
      const allowedRoles = PERMISSIONS[permission];
      return (allowedRoles as readonly UserRole[]).includes(req.user!.role);
    });

    if (!hasPermission) {
      return next(
        ApiError.forbidden(
          "Access denied. You don't have permission to access this feature."
        )
      );
    }

    next();
  };
}

/**
 * Helper to check permission in service layer
 */
export function hasPermission(role: UserRole, permission: Permission): boolean {
  const allowedRoles = PERMISSIONS[permission];
  return (allowedRoles as readonly UserRole[]).includes(role);
}

/**
 * Helper to check if user is admin
 */
export function isAdmin(role: UserRole): boolean {
  return role === UserRole.COMPANY_ADMIN || role === UserRole.SUPER_ADMIN;
}

/**
 * Helper to check if user is intern
 */
export function isIntern(role: UserRole): boolean {
  return role === UserRole.INTERN;
}
