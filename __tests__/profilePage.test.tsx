import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ProfilePage from '@/app/profile/page';
import { createClient } from '@/utils/supabase/server';
import { useRouter } from 'next/router';
import { redirect } from 'next/navigation';
 
jest.mock('@/utils/supabase/server');
jest.mock('next/router', () => ({
    useRouter: jest.fn(),
}));
jest.mock('next/navigation', () => ({
    redirect: jest.fn(),
}));

describe('Profile Page', () => {
    beforeEach(() => {
        (createClient as jest.Mock).mockResolvedValue({
            auth: {
                getUser: jest.fn().mockResolvedValue({
                    data: { user: { email: 'test@example.com' } },
                    error: null,
                }),
                signOut: jest.fn().mockResolvedValue({}),
            },
        });
    });

    it('renders the page without crashing', async () => {
        render(<ProfilePage />);
        expect(await screen.findByText('Hello test@example.com')).toBeInTheDocument();
    });
    
    it('redirects to login if there is an error or no user', async () => {
        (createClient as jest.Mock).mockResolvedValueOnce({
            auth: {
                getUser: jest.fn().mockResolvedValue({
                    data: null,
                    error: 'Error',
                }),
            },
        });

        render(<ProfilePage />);
        await waitFor(() => {
            expect(redirect).toHaveBeenCalledWith('/login');
        });
    });

    it('calls signOut and redirects to login on logout', async () => {
        render(<ProfilePage />);
        const logoutButton = await screen.findByText('Logout');
        fireEvent.click(logoutButton);

        await waitFor(() => {
            expect(createClient().auth.signOut).toHaveBeenCalled();
            expect(redirect).toHaveBeenCalledWith('/login');
        });
    });
});