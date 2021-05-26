import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  fullName: string;
  email: string;
  firstName: string;
  lastName: string;
  userDetails: any;

  constructor() { }

  ngOnInit(): void {
    this.userDetails = JSON.parse(localStorage.getItem('userDetails'));
    this.firstName = this.userDetails.firstName;
    this.lastName = this.userDetails.lastName;
    this.email = this.userDetails.email;
    //this.fullName = this.userDetails.firstName + ' ' + this.userDetails.lastName;
    this.fullName = `${this.userDetails.firstName }  ${this.userDetails.lastName}`;
  }

}

