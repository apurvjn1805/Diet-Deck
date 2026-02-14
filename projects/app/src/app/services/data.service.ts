import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';

export interface UserProfile {
    id: string;
    weight: number | null;
    food_preferences: string[];
    updated_at?: string;
}

@Injectable({
    providedIn: 'root'
})
export class DataService {
    constructor(private supabase: SupabaseService) { }

    async getProfile() {
        const user = this.supabase.currentUser;
        if (!user) return null;

        const { data, error } = await this.supabase.client
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

        if (error && error.code !== 'PGRST116') {
            console.error('Error fetching profile:', error);
            return null;
        }

        return data as UserProfile;
    }

    async updateProfile(profile: Partial<UserProfile>) {
        const user = this.supabase.currentUser;
        if (!user) throw new Error('User not authenticated');

        const { data, error } = await this.supabase.client
            .from('profiles')
            .upsert({
                id: user.id,
                ...profile,
                updated_at: new Date().toISOString()
            })
            .select()
            .single();

        if (error) throw error;
        return data;
    }
}
