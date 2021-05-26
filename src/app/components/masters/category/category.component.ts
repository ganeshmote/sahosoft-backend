import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DbOperation } from 'src/app/shared/db-operation';
import { DataService } from 'src/app/shared/services/data.service';
import { ToastrService } from 'ngx-toastr';
import { TextFieldValidator, NoWhitespaceValidator, NumericFieldValidator } from 'src/app/Validators/validations.validator';
import { Global } from 'src/app/shared/global';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {

  categoryForm: FormGroup;
  dbops: DbOperation;
  objRows = [];
  objRow: any;
  buttonText: string;
  selected = [];
  fileToUpload: File;

  formErrors = {
    'name': '',
    'title':'',
'isSave':'',
  };

  validationMessage = {
    'name': {
      'required': 'Name is required',
      'minlength': 'Name cannot be less than 3 characters long',
      'maxlength': 'Name cannot be more than 10 characters long',
      'validTextField': 'Name must contains only numbers and letters',
      'notWhiteSpaceValidator': 'Only white space not allowed'
    },
    'title': {
      'required': 'Name is required',
      'minlength': 'Name cannot be less than 3 characters long',
      'maxlength': 'Name cannot be more than 10 characters long',
      'validTextField': 'Name must contains only numbers and letters',
      'notWhiteSpaceValidator': 'Only white space not allowed'
    },
    'isSave': {
      'required': 'Save value is required',
      'minlength': 'Save value cannot be less than 1 characters long',
      'maxlength': 'Save cannot be more than 2 characters long',
      'validTextField': 'Save value must contains only numbers',
      'notWhiteSpaceValidator': 'Only white space not allowed'
    },
    'link': {
      'required': 'Link is required',
      'minlength': 'Link cannot be less than 3 characters long',
      'maxlength': 'Link cannot be more than 255 characters long',
      'validTextField': 'Link must contains only numbers and letters',
      'notWhiteSpaceValidator': 'Only white space not allowed'
    }
  };


  @ViewChild('tabset') elname: any;
  constructor(private _dataService: DataService, private _fb: FormBuilder, private _toastr: ToastrService) { }

  setFormState() {
    this.dbops = DbOperation.create;
    this.buttonText = "Submit";
    this.categoryForm = this._fb.group({
      Id: [0],
      name: ['', Validators.compose([
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(10),
        TextFieldValidator.validTextField,
        NoWhitespaceValidator.notWhiteSpaceValidator
      ])],
      title: ['', Validators.compose([
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(10),
        TextFieldValidator.validTextField,
        NoWhitespaceValidator.notWhiteSpaceValidator
      ])],
      isSave: ['', Validators.compose([
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(2),
        NumericFieldValidator.validNumericField,
        NoWhitespaceValidator.notWhiteSpaceValidator
      ])],
      link: ['', Validators.compose([
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(255),
        TextFieldValidator.validTextField,
        NoWhitespaceValidator.notWhiteSpaceValidator
      ])],
      image: ['']
    });

    this.categoryForm.valueChanges.subscribe(fData => this.onValueChanged());
    this.categoryForm.reset();
  }

  ngOnInit(): void {
    this.setFormState();
    this.getData();
  }

  onValueChanged() {
    if (!this.categoryForm) {
      return;
    }

    const form = this.categoryForm;
    for (const field of Object.keys(this.formErrors)) {
      this.formErrors[field] = '';
      const control = form.get(field);

      if (control && control.dirty && !control.valid) {
        const message = this.validationMessage[field];

        for (const key of Object.keys(control.errors)) {
          this.formErrors[field] += message[key] + ' ';
        }
      }
    }
  }

  getData() {
    this._dataService.get(Global.BASE_USER_ENDPOINT + "Category/getAll").subscribe(res => {
      if (res.isSuccess) {
        debugger;
        this.objRows = res.data;
      } else {
        this._toastr.error(res.errors[0], "Category Master");
      }
    });
  }

  upload(files: any) {
    if (files.length === 0) {
      return;
    }
    this.fileToUpload = files[0];
  }

  onSubmit() {
    debugger;
    if (this.dbops === 1 && !this.fileToUpload) {
      this._toastr.error("Please Upload Images !!", "Category Master");
    }

    const formData = new FormData();
    formData.append('Id', this.categoryForm.controls['Id'].value);
    formData.append('Name', this.categoryForm.controls['name'].value);
    formData.append('Title', this.categoryForm.controls['title'].value);
    formData.append('IsSave', this.categoryForm.controls['isSave'].value);
    formData.append('Link', this.categoryForm.controls['link'].value);

    if (this.fileToUpload) {
      formData.append("Image", this.fileToUpload, this.fileToUpload.name);
    }

    switch (this.dbops) {
      case DbOperation.create:
        this.categoryForm.controls["Id"].setValue(0);
        this._dataService.postImages(Global.BASE_USER_ENDPOINT + "Category/Save/", formData).subscribe(res => {
          debugger;
          if (res.isSuccess) {
            this.getData();
            this._toastr.success("Data saved successfully !!", "Category Master");
            this.elname.select('Viewtab');
            this.cancelForm();
          } else {
            this._toastr.info(res.errors[0], "Category Master");
          }
        });
        break;
      case DbOperation.update:
        this._dataService.postImages(Global.BASE_USER_ENDPOINT + "Category/Update/", formData).subscribe(res => {
          if (res.isSuccess) {
            this.getData();
            this._toastr.success("Data updated successfully !!", "Category Master");
            this.elname.select('Viewtab');
            this.cancelForm();
          } else {
            this._toastr.info(res.errors[0], "Category Master");
          }
        });
        break;
    }
  }

  Edit(Id: number) {
    debugger;
    this.dbops = DbOperation.update;
    this.elname.select('Addtab');
    this.buttonText = "Update";
    this.objRow = this.objRows.find(x => x.id == Id);
    this.categoryForm.controls["Id"].setValue(this.objRow.id);
    this.categoryForm.controls["name"].setValue(this.objRow.name);
    this.categoryForm.controls["title"].setValue(this.objRow.title);
    this.categoryForm.controls["isSave"].setValue(this.objRow.isSave);
    this.categoryForm.controls["link"].setValue(this.objRow.link);
  }

  Delete(Id: number) {
    debugger;
    let obj = { id: Id };
    this._dataService.post(Global.BASE_USER_ENDPOINT + "Category/Delete/", obj).subscribe(res => {
      if (res.isSuccess) {
        this.getData();
        this._toastr.success("Data deleted successfully !!", "Category Master");
      } else {
        this._toastr.info(res.errors[0], "Category Master");
      }
    });
  }

  cancelForm() {
    this.dbops = DbOperation.create;
    this.buttonText = "Submit";
    this.fileToUpload=null;
    if (this.categoryForm.value != null) {
      this.setFormState()
    }
  }

  setForm() {
    this.categoryForm.reset();
    this.dbops = DbOperation.create;
    this.buttonText = "Submit";
    this.elname.select('Viewtab');
  }
  ngOnDestroy() {
    this.objRows = null;
    this.objRow = null;
    this.fileToUpload = null;
  }
}

