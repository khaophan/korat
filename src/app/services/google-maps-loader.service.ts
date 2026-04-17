import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GoogleMapsLoaderService {
  private isLoaded = signal(false);
  private isLoading = false;

  load(): Promise<void> {
    if (this.isLoaded()) {
      return Promise.resolve();
    }

    if (this.isLoading) {
      return new Promise((resolve) => {
        const check = setInterval(() => {
          if (this.isLoaded()) {
            clearInterval(check);
            resolve();
          }
        }, 100);
      });
    }

    this.isLoading = true;

    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      // Use the global GOOGLE_MAPS_API_KEY if available, otherwise it will fail or need to be provided
      const apiKey = typeof GOOGLE_MAPS_API_KEY !== 'undefined' ? GOOGLE_MAPS_API_KEY : '';
      
      if (!apiKey) {
        console.error('GOOGLE_MAPS_API_KEY is not defined. Please set it in your environment variables.');
      }

      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places,geometry,drawing`;
      script.async = true;
      script.defer = true;
      
      script.onload = () => {
        this.isLoaded.set(true);
        this.isLoading = false;
        resolve();
      };

      script.onerror = (error) => {
        this.isLoading = false;
        reject(error);
      };

      document.head.appendChild(script);
    });
  }

  isReady() {
    return this.isLoaded();
  }
}
