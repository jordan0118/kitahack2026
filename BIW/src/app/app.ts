import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GeminiService } from './services/gemini';
import { Firestore, collection, getDocs } from '@angular/fire/firestore';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div style="padding: 20px; font-family: sans-serif; max-width: 800px; margin: 0 auto;">
      <h1>Project Leader Dashboard</h1>

      <div style="margin:  20px 0;">
        <button 
          (click)="testAI()" 
          [disabled]="aiLoading"
          style="padding: 10px 20px; font-size: 16px; cursor: pointer; background:  #4285f4; color: white; border: none; border-radius: 4px;">
          {{ aiLoading ? '⏳ Thinking.. .' : '🤖 Test Gemini AI' }}
        </button>
        
        <div style="margin-top: 10px; padding: 15px; background: #f8f9fa; border-radius: 4px; min-height: 60px;">
          <strong>AI Says:</strong>
          <p style="margin: 5px 0 0 0; white-space: pre-wrap;">{{ aiResponse }}</p>
          
          @if (aiLoading) {
            <div style="margin-top: 10px; color: #666;">
              <div style="display:  inline-block; width: 8px; height: 8px; border-radius: 50%; background: #4285f4; animation: pulse 1s infinite;"></div>
              <span style="margin-left: 8px;">AI is processing your request...  (typically 2-5 seconds)</span>
            </div>
          }
        </div>
      </div>

      <hr style="margin: 30px 0;">

      <div style="margin:  20px 0;">
        <button 
          (click)="testFirebase()" 
          [disabled]="dbLoading"
          style="padding: 10px 20px; font-size: 16px; cursor: pointer; background: #f4b400; color: white; border:  none; border-radius: 4px;">
          {{ dbLoading ? '⏳ Connecting...' : '🔥 Test Database' }}
        </button>
        
        <div style="margin-top: 10px; padding: 15px; background: #f8f9fa; border-radius: 4px;">
          <strong>DB Status:</strong> {{ dbStatus }}
        </div>
      </div>

      <hr style="margin: 30px 0;">

      <div style="margin: 20px 0;">
        <button 
          (click)="testListModels()"
          style="padding: 10px 20px; font-size: 16px; cursor: pointer; background:  #0f9d58; color: white; border: none; border-radius: 4px;">
          📋 List Available Models
        </button>
        
        <pre style="margin-top: 10px; background: #f8f9fa; padding: 15px; border-radius: 4px; max-height: 300px; overflow:  auto; font-size: 12px;">{{ modelsList }}</pre>
      </div>
    </div>

    <style>
      @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.3; }
      }
      
      button:disabled {
        opacity: 0.6;
        cursor: not-allowed !important;
      }
      
      button:not(:disabled):hover {
        filter: brightness(1.1);
      }
    </style>
  `
})
export class AppComponent {
  private gemini = inject(GeminiService);
  private firestore = inject(Firestore);

  aiResponse = 'Waiting... ';
  dbStatus = 'Waiting...';
  modelsList = 'Click button to list models... ';
  
  aiLoading = false;
  dbLoading = false;

  async testAI() {
    this.aiLoading = true;
    this.aiResponse = 'Thinking...';
    
    const startTime = Date.now();
    
    try {
      this.aiResponse = await this.gemini.generateText('Hello!  Are you ready? ');
      const duration = ((Date.now() - startTime) / 1000).toFixed(1);
      console.log(`✅ Response received in ${duration}s`);
    } catch (error:  any) {
      this.aiResponse = `Error: ${error.message}`;
    } finally {
      this.aiLoading = false;
    }
  }

  async testFirebase() {
    this.dbLoading = true;
    this.dbStatus = 'Connecting...';
    
    try {
      const ref = collection(this.firestore, 'test');
      await getDocs(ref); 
      this.dbStatus = '✅ Connected!  (Read success)';
    } catch (err:  any) {
      this.dbStatus = `❌ Connection Failed: ${err.message}`;
    } finally {
      this. dbLoading = false;
    }
  }

  async testListModels() {
    this.modelsList = 'Loading... ';
    
    const url = `https://generativelanguage.googleapis.com/v1beta/models? key=${environment.geminiApiKey}`;
    
    try {
      const response = await fetch(url);
      const data = await response.json();
      
      if (response.ok) {
        console.log('Available models:', data);
        const models = data.models?. map((m: any) => m.name).join('\n') || 'No models found';
        this.modelsList = `✅ Available models:\n\n${models}`;
      } else {
        this.modelsList = `❌ Error: ${data.error?. message || 'Unknown error'}`;
      }
    } catch (error: any) {
      this.modelsList = `❌ Network error: ${error.message}`;
    }
  }
}