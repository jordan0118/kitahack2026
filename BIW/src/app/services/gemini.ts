import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GeminiService {

  async generateText(prompt: string): Promise<string> {
    const API_KEY = environment.geminiApiKey;
    
    // ✅ Use gemini-2.5-flash (it exists in your models list!)
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;
    
    try {
      console.log('Calling Gemini API with model:  gemini-2.5-flash');
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('API Error Response:', errorData);
        return `❌ Error ${response.status}: ${errorData.error?.message || 'Unknown error'}`;
      }

      const data = await response.json();
      console.log('✅ Gemini responded successfully! ');
      
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (! text) {
        return '❌ No response from Gemini';
      }
      
      return text;
      
    } catch (error:  any) {
      console.error('Network Error:', error);
      return `❌ Network Error: ${error.message}`;
    }
  }
}