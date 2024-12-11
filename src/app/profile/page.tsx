import { redirect } from 'next/navigation';

import { createClient } from '@/utils/supabase/server';

export default async function ProfilePage() {
    const supabase = await createClient();

    const { data, error } = await supabase.auth.getUser();

    const signOut = async () => {
        'use server';

        const supabase = await createClient();
        await supabase.auth.signOut();
        redirect('/login');
    };

    if (error || !data?.user) {
        redirect('/login');
    }

    return (
        <div className="space-y-4">
            <p>Hello {data.user.email}</p>
            <form action={signOut}>
                <button
                    type="submit"
                    className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                >
                    Logout
                </button>
            </form>
        </div>
    );
}
