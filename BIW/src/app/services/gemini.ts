import { Injectable } from '@angular/core';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GeminiService {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor() {
    // Initialize the Google AI Client
    this.genAI = new GoogleGenerativeAI(environment.geminiApiKey);
    // Use the correct model name (try these in order)
    this.model = this.genAI.getGenerativeModel({ model: "gemini-pro" });
    // Alternative models if gemini-pro doesn't work: 
    // this.model = this.genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    // this.model = this.genAI.getGenerativeModel({ model: "gemini-1.0-pro" });
  }

  // This is the function your team will call
  async generateText(prompt: string): Promise<string> {
    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error("Gemini Error:", error);
      return "Error:  Could not connect to Gemini.  Check your API Key.";
    }
  }
}