import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, beforeEach, expect, vi, Mock } from 'vitest';
import Page from '../../../../app/(full-page)/auth/google/page'; // Adjust the import path
import { useCookies } from 'react-cookie';
import { useSearchParams } from 'next/navigation';
import { LayoutContext } from '../../../../layout/context/layoutcontext';
import { GoogleSigninService } from '../../../../service/GoogleSignInService';
import { redirect } from 'next/navigation';

// Mocking the necessary dependencies
vi.mock('react-cookie', () => ({
    useCookies: vi.fn(),
  }));
  
  vi.mock('next/navigation', () => ({
    useSearchParams: vi.fn(),
    redirect: vi.fn(),
  }));
  
  vi.mock('@/service/GoogleSignInService', () => ({
    GoogleSigninService:{
        getAuthenticated: vi.fn().mockResolvedValue({}),
        signIn: vi.fn().mockResolvedValue({}),
        generateRandomBytes: vi.fn().mockReturnValue('random-state'),
        generateCodeChallenge: vi.fn().mockResolvedValue({ codeChallenge: 'code-challenge', codeVerifier: 'code-verifier' }),
    }
  }));
  
  const mockLayoutConfig = {
    inputStyle: 'filled',
    colorScheme: 'light',
    ripple: true,           // Provide a default value
    menuMode: 'static',     // Provide a default value
    theme: 'default',       // Provide a default value
    scale: 1,               // Provide a default value
  };

  // Mock layout context
    const mockLayoutContext = {
    layoutConfig: mockLayoutConfig,
    setLayoutConfig: vi.fn(),        // Mock function
    layoutState: {},                  // Mock state object
    setLayoutState: vi.fn(),          // Mock function
    onMenuToggle: vi.fn(),            // Mock function
    showProfileSidebar: vi.fn(),      // Example boolean value
  };
  
  
  describe('Page', () => {
    const setCookiesMock = vi.fn();
    const removeCookieMock = vi.fn();
    const cookiesMock = { state: 'random-state', code_verifier: 'code-verifier' };
    
    beforeEach(() => {
      (useCookies as Mock).mockReturnValue([cookiesMock, setCookiesMock, removeCookieMock]);
      (useSearchParams as Mock).mockReturnValue({
        get: vi.fn((param) => {
          if (param === 'state') return 'random-state';
          if (param === 'code') return 'auth-code';
          return null;
        }),
      });
      vi.clearAllMocks();
    });
  
    it('renders the Google Auth Page correctly', () => {
      render(
        <LayoutContext.Provider value={mockLayoutContext}>
          <Page />
       </LayoutContext.Provider>
      );
  
      expect(screen.getByText(/Sign in to continue/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /oogle/i })).toBeInTheDocument();
    });
  
    it('calls signIn and sets cookies when the button is clicked', async () => {
      render(
        <LayoutContext.Provider value={mockLayoutContext}>
          <Page />
        </LayoutContext.Provider>
      );
  
      const button = screen.getByRole('button', { name: /oogle/i });
      fireEvent.click(button);
  
      await waitFor(() => {
        expect(setCookiesMock).toHaveBeenCalledWith('code_verifier', 'code-verifier', expect.any(Object));
        expect(setCookiesMock).toHaveBeenCalledWith('state', 'random-state', expect.any(Object));
        expect(GoogleSigninService.signIn).toHaveBeenCalledWith('random-state', 'code-challenge');
      });
    });
  
    it('redirects to /auth/access on denial', async () => {
      (GoogleSigninService.getAuthenticated as Mock).mockRejectedValueOnce(new Error('Denied'));
  
      render(
        <LayoutContext.Provider value={{ layoutConfig: mockLayoutConfig }}>
          <Page />
        </LayoutContext.Provider>
      );
  
      await waitFor(() => {
        expect(redirect).toHaveBeenCalledWith('/auth/access');
      });
    });
  
    it('redirects to appropriate URL after login', async () => {
      (GoogleSigninService.getAuthenticated as Mock).mockResolvedValueOnce({});
      render(
        <LayoutContext.Provider value={{ layoutConfig: mockLayoutConfig }}>
          <Page />
        </LayoutContext.Provider>
      );
  
      await waitFor(() => {
        expect(removeCookieMock).toHaveBeenCalledWith('state');
        expect(removeCookieMock).toHaveBeenCalledWith('code_verifier');
        expect(redirect).toHaveBeenCalledWith('/quiz/practice');
      });
    });
  
    it('handles redirection from sessionStorage', async () => {
      sessionStorage.setItem('redirection', '/custom/url');
  
      (GoogleSigninService.getAuthenticated as Mock).mockResolvedValueOnce({});
      render(
        <LayoutContext.Provider value={{ layoutConfig: mockLayoutConfig }}>
          <Page />
        </LayoutContext.Provider>
      );
  
      await waitFor(() => {
        expect(redirect).toHaveBeenCalledWith('/custom/url');
        sessionStorage.removeItem('redirection');
      });
    });
  });