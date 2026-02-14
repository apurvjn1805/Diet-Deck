import { Injectable } from '@angular/core';
import { createClient, SupabaseClient, User } from '@supabase/supabase-js';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class SupabaseService {
    private supabase: SupabaseClient;
    private _user = new BehaviorSubject<User | null>(null);

    constructor() {
        this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);

        // Listen for auth changes
        this.supabase.auth.onAuthStateChange((event, session) => {
            this._user.next(session?.user ?? null);
        });

        // Check current session
        this.supabase.auth.getUser().then(({ data: { user } }) => {
            this._user.next(user);
        });
    }

    get user$(): Observable<User | null> {
        return this._user.asObservable();
    }

    get currentUser(): User | null {
        return this._user.value;
    }

    async signInWithGoogle() {
        return await this.supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: window.location.origin
            }
        });
    }

    async signOut() {
        return await this.supabase.auth.signOut();
    }

    // Helper for database operations
    get client(): SupabaseClient {
        return this.supabase;
    }
}
