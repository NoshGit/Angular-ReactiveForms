import { AbstractControl, ValidatorFn } from "@angular/forms";

export let ratingRange = (min: number, max: number): ValidatorFn => {
    return (c: AbstractControl): { [key: string]: boolean } | null => {
      if (c.value !== null && (isNaN(c.value) || c.value < min || c.value > max)) {
        return { range: true };
      }
      return null;
    };
}


export let emailMatcher = (c: AbstractControl): { [key: string]: boolean } | null => {
    const emailControl = c.get('email');
    const confirmControl = c.get('confirmEmail');
    const feildsUntouched = emailControl?.pristine || confirmControl?.pristine;    
  
    if ((emailControl?.value === confirmControl?.value) || feildsUntouched) {
      return null;
    }
    return { match: true };
  }