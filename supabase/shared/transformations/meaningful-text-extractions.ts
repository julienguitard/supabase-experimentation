import type { Option } from "../../../packages/types/index.ts";


//TO DO check deepseek generation of meaningful text cleaners

export function extractMeaningfulText(data:any,cleaners: Array<(value: any, path: string) => any>
):Option<string>
 {
    function clean(value: any, path: string = ''): any {
      // Apply all cleaners in sequence
      let cleaned = value;
      for (const cleaner of cleaners) {
        cleaned = cleaner(cleaned, path);
        if (cleaned == null) break; // Stop if cleaner returns null
      }
  
      if (cleaned == null) return null;
  
      // Recursively clean children
      if (Array.isArray(cleaned)) {
        return cleaned
          .map((item, index) => clean(item, `${path}[${index}]`))
          .filter(item => item != null);
      }
  
      if (typeof cleaned === 'object') {
        const result: Record<string, any> = {};
        for (const [key, val] of Object.entries(cleaned)) {
          const cleanedVal = clean(val, path ? `${path}.${key}` : key);
          if (cleanedVal != null) {
            result[key] = cleanedVal;
          }
        }
        return Object.keys(result).length > 0 ? result : null;
      }
  
      return cleaned;
    }
  
    return clean(data);
  }


  export const meaningfulTextCleaners = [
    // Cleaner 1: Clean strings
    (value, path) => {
      if (typeof value === 'string') {
        const cleaned = value.trim().replace(/\s+/g, ' ');
        return cleaned.length > 10 ? cleaned : null;
      }
      return value;
    },
    
    // Cleaner 2: Filter unwanted content
    (value, path) => {
      if (typeof value === 'string') {
        const unwanted = ['error while loading', 'reload this page'];
        return unwanted.some(u => value.includes(u)) ? null : value;
      }
      return value;
    },
    
    // Cleaner 3: Extract specific fields
    (value, path) => {
      if (path.includes('text') || path.includes('html') || path.includes('description')) {
        return value; // Keep these
      }
      return value; // Could filter others if needed
    }
  ]