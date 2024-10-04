import {AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';

export const API_BASE: string = 'https://api.thecatapi.com/v1';
export const API_KEY: string = 'live_al1tRQ2Kn57Up4Y4lzoTDHXGJ9Y0swzRGwb1rR6G5TZRU4mSieABEYUadQorRdpK';

export enum FilterFormFieldsEnum {
  IMAGE_NUMBER = 'imageNumber',
  SELECT_ALL = 'selectAll',
  BREEDS = 'breeds',
}

export function isValidNumberValidator(): ValidatorFn {
  return (control: AbstractControl) : ValidationErrors | null => {

    const value = control.value;

    if (!value) {
      return null;
    }

    const isValidNum = /^[1-9]\d*$/.test(value);

    return !isValidNum ? {isValidNumber: true} : null;
  }
}
