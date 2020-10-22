import { AbstractControl, ValidationErrors } from '@angular/forms';
import {FormArray,FormBuilder,FormGroup,FormControl, Validators} from '@angular/forms';
export class CustomValidators{
    static notSpace(control:AbstractControl) : ValidationErrors | null {
      //  if((control.value as string).indexOf(' ')>=0)
           //  return {notSpace:true} ;
      
           //  return null;
           if(!(/^[^ ]*$/.test(control.value))){
            return {notSpace:true}
        }
        return null;
        }

        static noSpecial(control:AbstractControl) : ValidationErrors | null {
    
            if(!(/^[^`~!@#$%\^&*()_+={}|[\]\\:';"<>?,./]*$/.test(control.value))){
              return {noSpecial:true}
              
            }
              return null;
            }

            static notNumber(control:AbstractControl) : ValidationErrors | null {
                       if(!(/^[^0-9]*$/.test(control.value))){
                           return {notNumber:true}
                       }
                       return null;
            }

            static notAlphabet(control:AbstractControl) : ValidationErrors | null {
                if(!(/^[^a-zA-Z]*$/.test(control.value))){
                    return {notAlphabet:true}
                }
                return null;
            
            }

            
          
}