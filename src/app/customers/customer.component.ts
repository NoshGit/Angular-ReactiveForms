import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

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
      rating:['', ratingRange(1,5)]
    });
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
