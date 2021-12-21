import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl, FormArray} from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { Customer } from './customer';
import { emailMatcher, ratingRange } from './customer.validator';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})
export class CustomerComponent implements OnInit {
  customerForm!: FormGroup;
  customer = new Customer();
  emailMessage: string = '';

  get addresses(): FormArray {
    return <FormArray>this.customerForm.get('addresses');
  }

  private validationMessages : any = {
    required: 'Please enter your email address.',
    email: 'Please enter a valid email address.'
  };

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.customerForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(3)]],
      lastName: ['', [Validators.required, Validators.maxLength(50)]],
      emailGroup: this.fb.group({
        email: ['', Validators.required],
        confirmEmail: ['', Validators.required]
      }, {validator: emailMatcher}),
      phone:'',
      notification:'email',
      sendCatalog: true,
      rating:['', ratingRange(1,5)],
      addresses: this.fb.array([this.buildAddress()]) 
    });
    
    //this is known as watching Form Controls
    this.customerForm.get('notification')?.valueChanges.subscribe(
      //checking value change and Reacting.
      value => this.setNotifyMe(value)
    );

    const emailControl = this.customerForm.get('emailGroup.email');

    emailControl?.valueChanges.pipe(
      debounceTime(1000)
    ).subscribe(
      value => this.setErrorMsg(emailControl)
    )
  }

  buildAddress(): FormGroup {
    return this.fb.group({
      addressType:'home',
      street1:'',
      street2:'',
      city:'',
      state:'',
      zip:''
    })
  }

  addAddress(): void {
    this.addresses.push( this.buildAddress() );
  }

  populateTestData(): void {
    /* this.customerForm.setValue({
      firstName: 'Noshir',
      lastName: 'Patel',
      email:'noshir@gmail.com',
      sendCatalog: false
    }); */

    this.customerForm.patchValue({
      emailGroup: {email:'noshirpatchemail@gmail.com'}
    })
  } 

  save(): void {
    console.log(this.customerForm);
    console.log('Saved: ' + JSON.stringify(this.customerForm.value));
  }

  setErrorMsg(c: AbstractControl): void {
    this.emailMessage = '';
    if ((c.touched || c.dirty) && c.errors) {
      this.emailMessage = Object.keys(c.errors).map(
        key => this.validationMessages[key]).join(' ');
    }
  }

  setNotifyMe(notify: string) : void {
    var phoneCtrl = this.customerForm.get('phone');

    if(notify === 'text'){
      phoneCtrl?.setValidators(Validators.required);
    }else{
      phoneCtrl?.clearValidators();
    }

    phoneCtrl?.updateValueAndValidity();
  }
}
