import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Injectable, inject } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class AiService {
    private http = inject(HttpClient);

    async generateRecipe(foodName: string, proteinTarget: number) {
        try {
            const response = await firstValueFrom(
                this.http.post<any>('/api/ai', {
                    type: 'recipe',
                    payload: { foodName, proteinTarget }
                })
            );
            return response;
        } catch (error) {
            console.error('Gemini Recipe Error:', error);
            throw error;
        }
    }

    async getSmartSuggestions(currentPlan: string, proteinGap: number) {
        try {
            const response = await firstValueFrom(
                this.http.post<any>('/api/ai', {
                    type: 'suggestion',
                    payload: { currentPlan, proteinGap }
                })
            );
            return response.text || '';
        } catch (error) {
            console.error('Gemini Suggestion Error:', error);
            return 'Could not get suggestions right now. Try adding some Greek Yogurt or Soya chunks!';
        }
    }
}
