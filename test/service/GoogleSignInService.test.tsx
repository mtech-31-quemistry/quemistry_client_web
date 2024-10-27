import { describe, it, expect, beforeEach, vi } from 'vitest';
import { GoogleSigninService } from '../../service/GoogleSignInService';
import { PKCECodeChallenge } from '@/types';

const mockFetch = vi.fn();

global.fetch = mockFetch; // Mocking the global fetch API

describe('GoogleSigninService', () => {
    const state = 'test-state';
    const codeChallenge = 'test-code-challenge';

    beforeEach(() => {
        vi.clearAllMocks();
        // Reset sessionStorage before each test
        sessionStorage.clear();
    });

    it('should generate random bytes', () => {
        const randomBytes = GoogleSigninService.generateRandomBytes();
        expect(randomBytes).toHaveLength(16); // 8 bytes in hex
    });

    // it('should sign in and set window location.href', () => {
    //     const idpAuthorizeEndpoint = 'https://example.com/auth';
    //     process.env.NEXT_PUBLIC_IDP_AuthorizeEndpoint = idpAuthorizeEndpoint;
    //     const clientId = 'test-client-id';
    //     process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID = clientId;
    //     process.env.NEXT_PUBLIC_RedirectUrl = 'https://example.com/callback';

    //     const hrefSpy = vi.spyOn(window.location, 'href', 'set');

    //     GoogleSigninService.signIn(state, codeChallenge);

    //     expect(hrefSpy).toHaveBeenCalledWith(
    //         `${idpAuthorizeEndpoint}?response_type=code&client_id=${clientId}&state=${state}&code_challenge_method=S256&code_challenge=${codeChallenge}&scope=openid+email&identity_provider=Google&redirect_uri=https://example.com/callback`
    //     );
    // });

    it('should generate code challenge', async () => {
        const codeChallengeResponse: PKCECodeChallenge = await GoogleSigninService.generateCodeChallenge();

        expect(codeChallengeResponse).toHaveProperty('codeVerifier');
        expect(codeChallengeResponse).toHaveProperty('codeChallenge');
        expect(codeChallengeResponse.codeVerifier).toHaveLength(56); // Adjust based on generateRandomString length
    });

    it('should get access token', async () => {
        const mockResponse = { access_token: 'test-access-token' };
        mockFetch.mockResolvedValueOnce({
            ok: true,
            json: async () => mockResponse,
        });

        const response = await GoogleSigninService.getAccessToken('verifier', 'authCode');
        expect(mockFetch).toHaveBeenCalledWith(expect.any(String), expect.objectContaining({ method: 'POST' }));
        expect(response).toEqual(mockResponse);
    });

    it('should throw an error when get access token fails', async () => {
        mockFetch.mockResolvedValueOnce({ ok: false, status: 400 });

        await expect(GoogleSigninService.getAccessToken('verifier', 'authCode')).rejects.toThrow(
            '400 at signing with google account.'
        );
    });

    it('should get authenticated and store user in sessionStorage', async () => {
        const mockUserProfile = { id: 1, name: 'John Doe' };
        
        // Mock the fetch response to return a successful response with the user profile
        mockFetch.mockResolvedValueOnce({
            ok: true,
            json: async () => mockUserProfile,
        });
    
        const response = await GoogleSigninService.getAuthenticated('verifier', 'authCode');
    
        expect(mockFetch).toHaveBeenCalledWith(expect.any(String), expect.objectContaining({ method: 'POST' }));
        
        // Check that the user is stored correctly in sessionStorage
        expect(sessionStorage.getItem('USER')).toEqual(JSON.stringify(mockUserProfile));
        // expect(response).toEqual(mockUserProfile); // Expect the response to equal the mock user profile
    });

    it('should throw an error when get authenticated fails', async () => {
        mockFetch.mockResolvedValueOnce({ ok: false, status: 401 });

        await expect(GoogleSigninService.getAuthenticated('verifier', 'authCode')).rejects.toThrow(
            '401 at signing with google account.'
        );
    });

    it('should sign out and clear sessionStorage', async () => {
        mockFetch.mockResolvedValueOnce({ ok: true });

        await GoogleSigninService.signOut();

        expect(sessionStorage.getItem('IS_LOGIN')).toBe('false');
        expect(sessionStorage.getItem('USER')).toBeNull();
    });

    it('should throw an error when sign out fails', async () => {
        mockFetch.mockResolvedValueOnce({ ok: false, status: 500 });

        await expect(GoogleSigninService.signOut()).rejects.toThrow('500 at signing out.');
        expect(sessionStorage.getItem('IS_LOGIN')).toBe('false');
        expect(sessionStorage.getItem('USER')).toBeNull();
    });
});
