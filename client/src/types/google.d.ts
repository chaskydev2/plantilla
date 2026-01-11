declare global {
  interface Window {
    google?: {
      maps?: {
        Geocoder: new () => any;
        places?: {
          AutocompleteService: new () => any;
          AutocompleteSessionToken: new () => any;
        };
      };
    };
  }
  var google: typeof window.google;
}
export {};