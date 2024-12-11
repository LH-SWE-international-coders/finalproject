'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import { db } from '@/lib/db'; // Import Prisma client

export async function login(formData: FormData) {
    const supabase = await createClient()

    // type-casting here for convenience
    // in practice, you should validate your inputs
    const data = {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
    }

    const { error } = await supabase.auth.signInWithPassword(data)

    if (error) {
        redirect('/error')
    }

    revalidatePath('/', 'layout')
    redirect('/')
}

export async function signup(formData: FormData) {
    const supabase = await createClient();

    const data = {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
        name: formData.get('name') as string,
    };

    let redirectPath: string | null = null; // Track where to redirect

    try {
        // Sign up the user in Supabase
        const { data: user, error } = await supabase.auth.signUp({
            email: data.email,
            password: data.password,
        });

        if (error) {
            console.error('Error signing up user:', error.message);
            redirectPath = '/error';
            return; // Early exit to avoid further execution
        }

        if (user?.user) {
            // Validate required fields
            if (!user.user.id || !data.name) {
                throw new Error('Invalid data for student creation');
            }

            // Insert student record
            await db.students.create({
                data: {
                    id: user.user.id, // Supabase user ID
                    name: data.name, // User's name
                },
            });

            // If all succeeds, set redirect to home
            redirectPath = '/';
        } else {
            console.error('Unexpected user creation issue');
            redirectPath = '/error';
        }
    } catch (error) {
        const errorMessage =
            error instanceof Error
                ? error.message
                : 'An unknown error occurred during signup';

        console.error('Error during signup:', errorMessage);
        redirectPath = '/error';
    } finally {
        // Ensure redirect happens once try/catch logic completes
        if (redirectPath) {
            revalidatePath('/');
            redirect(redirectPath);
        }
    }
}