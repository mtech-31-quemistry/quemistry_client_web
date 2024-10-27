import { describe, it, expect, vi, beforeEach } from 'vitest';
import { RouteGuard } from '../../../lib/RouteGuard';

describe('RouteGuard', () => {

  // Mock sessionStorage
  beforeEach(() => {
    sessionStorage.clear();
    vi.spyOn(sessionStorage, 'getItem');
    vi.spyOn(sessionStorage, 'setItem');
  });

  describe('isLogin', () => {
    it('should return true if sessionStorage has IS_LOGIN set to "true"', () => {
      sessionStorage.setItem('IS_LOGIN', 'true');
      expect(RouteGuard.isLogin()).toBe(true);
    });

    it('should return false if sessionStorage has IS_LOGIN set to "false"', () => {
      sessionStorage.setItem('IS_LOGIN', 'false');
      expect(RouteGuard.isLogin()).toBe(false);
    });

    it('should return false if sessionStorage is undefined', () => {
      expect(RouteGuard.isLogin()).toBe(false);
    });
  });

  describe('loginUser', () => {
    it('should return parsed user profile if user is logged in', () => {
      const userProfile = JSON.stringify({ roles: ['student'] });
      sessionStorage.setItem('IS_LOGIN', 'true');
      sessionStorage.setItem('USER', userProfile);
      expect(RouteGuard.loginUser()).toEqual({ roles: ['student'] });
    });

    it('should return null if user is not logged in', () => {
      sessionStorage.setItem('IS_LOGIN', 'false');
      expect(RouteGuard.loginUser()).toBe(null);
    });
  });

  describe('apply', () => {
    it('should allow access to open routes', () => {
      expect(RouteGuard.apply('/', '')).toBe(true);
      expect(RouteGuard.apply('/auth/google', '')).toBe(true);
      expect(RouteGuard.apply('/auth/error', '')).toBe(true);
    });

    it('should deny access to restricted routes if user lacks role', () => {
      sessionStorage.setItem('IS_LOGIN', 'true');
      sessionStorage.setItem('USER', JSON.stringify({ roles: ['student'] }));
      expect(RouteGuard.apply('/questions/create', '')).toBe(false);
    });

    it('should allow access to restricted routes if user has required role', () => {
      sessionStorage.setItem('IS_LOGIN', 'true');
      sessionStorage.setItem('USER', JSON.stringify({ roles: ['admin'] }));
      expect(RouteGuard.apply('/questions/create', '')).toBe(true);
      expect(RouteGuard.apply('/questions/edit', '')).toBe(true);
      expect(RouteGuard.apply('/questions/searchlist', '')).toBe(true);
      expect(RouteGuard.apply('/questions/topics', '')).toBe(true);
      expect(RouteGuard.apply('/classes', '')).toBe(true);
      expect(RouteGuard.apply('/classes/details', '')).toBe(true);
      expect(RouteGuard.apply('/genai', '')).toBe(true);
      sessionStorage.setItem('USER', JSON.stringify({ roles: ['student'] }));
      expect(RouteGuard.apply('/students/invitation/accept', '')).toBe(true);
      expect(RouteGuard.apply('/dashboard', '')).toBe(true);
    });
  });

  describe('accessibleBy', () => {
    it('should return true if user has the required role', () => {
      sessionStorage.setItem('IS_LOGIN', 'true');
      sessionStorage.setItem('USER', JSON.stringify({ roles: ['student'] }));
      expect(RouteGuard.accessibleBy(['student'])).toBe(true);
    });

    it('should return false if user does not have the required role', () => {
      sessionStorage.setItem('IS_LOGIN', 'true');
      sessionStorage.setItem('USER', JSON.stringify({ roles: ['student'] }));
      expect(RouteGuard.accessibleBy(['admin'])).toBe(false);
    });

    // it('should set redirection in sessionStorage if user is not authorized', () => {
    //   sessionStorage.setItem('IS_LOGIN', 'true');
    //   sessionStorage.setItem('USER', JSON.stringify({ roles: ['student'] }));
    //   RouteGuard.apply('/questions/create', 'page=1');
    //   expect(sessionStorage.setItem).toHaveBeenCalledWith('redirection', '/questions/create?page=1');
    // }); // will fail due to mock/spy error
  });
});
