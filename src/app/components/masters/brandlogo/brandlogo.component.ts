import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DbOperation } from 'src/app/shared/db-operation';
import { DataService } from 'src/app/shared/services/data.service';
import { ToastrService } from 'ngx-toastr';
import { TextFieldValidator, NoWhitespaceValidator, NumericFieldValidator } from 'src/app/Validators/validations.validator';
import { Global } from 'src/app/shared/global';

@Component({
  selector: 'app-brandlogo',
  templateUrl: './brandlogo.component.html',
  styleUrls: ['./brandlogo.component.scss']
})
export class BrandlogoComponent implements OnInit {

  addForm: FormGroup;
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
    }
  };


  @ViewChild('tabset') elname: any;
  constructor(private _dataService: DataService, private _fb: FormBuilder, private _toastr: ToastrService) { }

  setFormState() {
    this.dbops = DbOperation.create;
    this.buttonText = "Submit";
    this.addForm = this._fb.group({
      Id: [0],
      name: ['', Validators.compose([
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(10),
        TextFieldValidator.validTextField,
        NoWhitespaceValidator.notWhiteSpaceValidator
      ])],
      image: ['']
    });

    this.addForm.valueChanges.subscribe(fData => this.onValueChanged());
    this.addForm.reset();
  }

  ngOnInit(): void {
    this.setFormState();
    this.getData();
  }

  onValueChanged() {
    if (!this.addForm) {
      return;
    }

    const form = this.addForm;
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
    this._dataService.get(Global.BASE_USER_ENDPOINT + "BrandLogo/getAll").subscribe(res => {
      if (res.isSuccess) {
        debugger;
        this.objRows = res.data;
      } else {
        this._toastr.error(res.errors[0], "BrandLogo Master");
      }
    });
  }

  upload(files: any) {
    debugger;
    if (files.length === 0) {
      return;
    }
    this.fileToUpload = files[0];
  }

  onSubmit() {
    debugger;
    if (this.dbops === 1 && !this.fileToUpload) {
      this._toastr.error("Please Upload Images !!", "BrandLogo Master");
    }

    const formData = new FormData();
    formData.append('Id', this.addForm.controls['Id'].value);
    formData.append('Name', this.addForm.controls['name'].value);

    if (this.fileToUpload) {
      formData.append("Image", this.fileToUpload, this.fileToUpload.name);
    }

    switch (this.dbops) {
      case DbOperation.create:
        this.addForm.controls["Id"].setValue(0);
        this._dataService.postImages(Global.BASE_USER_ENDPOINT + "BrandLogo/Save/", formData).subscribe(res => {
          debugger;
          if (res.isSuccess) {
            this.getData();
            this._toastr.success("Data saved successfully !!", "BrandLogo Master");
            this.elname.select('Viewtab');
            this.cancelForm();
          } else {
            this._toastr.info(res.errors[0], "BrandLogo Master");
          }
        });
        break;
      case DbOperation.update:
        this._dataService.postImages(Global.BASE_USER_ENDPOINT + "BrandLogo/Update/", formData).subscribe(res => {
          if (res.isSuccess) {
            this.getData();
            this._toastr.success("Data updated successfully !!", "BrandLogo Master");
            this.elname.select('Viewtab');
            this.cancelForm();
          } else {
            this._toastr.info(res.errors[0], "BrandLogo Master");
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
    this.addForm.controls["Id"].setValue(this.objRow.id);
    this.addForm.controls["name"].setValue(this.objRow.name);
  }

  Delete(Id: number) {
    debugger;
    let obj = { id: Id };
    this._dataService.post(Global.BASE_USER_ENDPOINT + "brandLogo/Delete/", obj).subscribe(res => {
      if (res.isSuccess) {
        this.getData();
        this._toastr.success("Data deleted successfully !!", "BrandLogo Master");
      } else {
        this._toastr.info(res.errors[0], "BrandLogo Master");
      }
    });
  }

  cancelForm() {
    this.dbops = DbOperation.create;
    this.buttonText = "Submit";
    if (this.addForm.value != null) {
      this.setFormState()
    }
  }

  setForm() {
    this.addForm.reset();
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

