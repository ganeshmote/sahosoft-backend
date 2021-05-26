import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { DbOperation } from 'src/app/shared/db-operation';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DataService } from 'src/app/shared/services/data.service';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { TextFieldValidator, NoWhitespaceValidator, NumericFieldValidator } from 'src/app/Validators/validations.validator';
import { Global } from 'src/app/shared/global';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss']
})
export class AddProductComponent implements OnInit {
  submitted: boolean = false;
  dbops: DbOperation;
  productId: number = 0;
  productForm: FormGroup;
  counter: number = 1;
  objRow: any;
  bigImage = "assets/images/pro3/1.jpg";
  url = [
    { img: "assets/images/user.png" },
    { img: "assets/images/user.png" },
    { img: "assets/images/user.png" },
    { img: "assets/images/user.png" },
    { img: "assets/images/user.png" }
  ];

  buttonText: string;
  fileTobeUpload = [];
  objUserTypes = [];
  objSizes = [];
  objCategories = [];
  objTags = [];
  objColors = [];

  formErrors = {
    name: '',
    title: '',
    code: '',
    price: '',
    salePrice: '',
    discount: '',
    sizeId: '',
    categoryId: '',
    tagId: '',
    colorId: '',
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
      'required': 'Title is required',
      'minlength': 'Title cannot be less than 3 characters long',
      'maxlength': 'Title cannot be more than 10 characters long',
      'validTextField': 'Title must contains only numbers and letters',
      'notWhiteSpaceValidator': 'Only white space not allowed'
    },
    'code': {
      'required': 'Code is required',
      'minlength': 'Code cannot be less than 3 characters long',
      'maxlength': 'Code cannot be more than 10 characters long',
      'validTextField': 'Code must contains only numbers and letters',
      'notWhiteSpaceValidator': 'Only white space not allowed'
    },
    'price': {
      'required': 'Price is required',
      'minlength': 'Price cannot be less than 1 characters long',
      'maxlength': 'Price cannot be more than 10 characters long',
      'validNumericField': 'Price must contains only numbers',
      'notWhiteSpaceValidator': 'Only white space not allowed'
    },
    'salePrice': {
      'required': 'Sale Price is required',
      'minlength': 'Sale Price cannot be less than 1 characters long',
      'maxlength': 'Sale Price cannot be more than 10 characters long',
      'validNumericField': 'Sale Price must contains only numbers',
      'notWhiteSpaceValidator': 'Only white space not allowed'
    },
    'discount': {
      'required': 'Discount is required',
      'minlength': 'Discount cannot be less than 1 characters long',
      'maxlength': 'Discount cannot be more than 10 characters long',
      'validNumericField': 'Discount must contains only numbers',
      'notWhiteSpaceValidator': 'Only white space not allowed'
    },
    'sizeId': {
      'required': 'Size is required'
    },
    'categoryId': {
      'required': 'Category is required'
    },
    'tagId': {
      'required': 'Tag is required'
    },
    'colorId': {
      'required': 'Color is required'
    }
  };

  @ViewChild('file') elfiles: ElementRef;
  constructor(private _dataService: DataService, private _fb: FormBuilder, private _toastr: ToastrService, private navRoute: Router,
    private route: ActivatedRoute) {
    this.route.queryParams.subscribe(params => {
      this.productId = params['productId']
    });
  }

  setFormState() {
    this.dbops = DbOperation.create;
    this.buttonText = "Submit";
    this.productForm = this._fb.group({
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
      code: ['', Validators.compose([
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(10),
        TextFieldValidator.validTextField,
        NoWhitespaceValidator.notWhiteSpaceValidator
      ])],
      price: ['', Validators.compose([
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(10),
        NumericFieldValidator.validNumericField,
        NoWhitespaceValidator.notWhiteSpaceValidator
      ])],
      salePrice: ['', Validators.compose([
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(10),
        NumericFieldValidator.validNumericField,
        NoWhitespaceValidator.notWhiteSpaceValidator
      ])],
      discount: ['', Validators.compose([
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(10),
        NumericFieldValidator.validNumericField,
        NoWhitespaceValidator.notWhiteSpaceValidator
      ])],
      sizeId: ['', Validators.required],
      categoryId: ['', Validators.required],
      tagId: ['', Validators.required],
      colorId: ['', Validators.required],
      quantity: [''],
      isSale: [''],
      isNew: [''],
      shortDetails: [''],
      description: ['']
    });

    this.productForm.valueChanges.subscribe(fData => this.onValueChanged());
    this.productForm.controls['quantity'].setValue(this.counter);
  }
  get f() {
    return this.productForm.controls;
  }

  onValueChanged() {
    if (!this.productForm) {
      return;
    }

    const form = this.productForm;
    for (const field of Object.keys(this.formErrors)) {
      this.formErrors[field] = '';
      const control = form.get(field);

      if (control && control.dirty && !control.valid) {
        const message = this.validationMessage[field];

        for (const key of Object.keys(control.errors)) {
          if (key != 'required') {
            this.formErrors[field] += message[key] + ' ';
          }
        }
      }
    }
  }
  ngOnInit(): void {
    this.setFormState();
    this.getUserType();
    this.getColors();
    this.getSizes();
    this.getCategories();
    this.getTags();

    if (this.productId != null && this.productId > 0) {
      this.getProductById();
      this.buttonText = "Update";
      this.dbops = DbOperation.update;
    }
  }
  getProductById() {
    this._dataService.get(Global.BASE_USER_ENDPOINT + "ProductMaster/GetbyId/" + this.productId).subscribe(res => {
      if (res.isSuccess) {
        this.objRow = res.data;
        this.productForm.controls['Id'].setValue(this.objRow.id);
        this.productForm.controls['name'].setValue(this.objRow.name);
        this.productForm.controls['title'].setValue(this.objRow.title);
        this.productForm.controls['code'].setValue(this.objRow.code);
        this.productForm.controls['price'].setValue(this.objRow.price);
        this.productForm.controls['salePrice'].setValue(this.objRow.salePrice);
        this.productForm.controls['discount'].setValue(this.objRow.discount);
        this.productForm.controls['sizeId'].setValue(this.objRow.sizeId);
        this.productForm.controls['categoryId'].setValue(this.objRow.categoryId);
        this.productForm.controls['tagId'].setValue(this.objRow.tagId);
        this.productForm.controls['colorId'].setValue(this.objRow.colorId);
        this.productForm.controls['quantity'].setValue(this.objRow.quantity);
        this.productForm.controls['isSale'].setValue(this.objRow.isSale);
        this.productForm.controls['isNew'].setValue(this.objRow.isNew);
        this.productForm.controls['shortDetails'].setValue(this.objRow.shortDetails);
        this.productForm.controls['description'].setValue(this.objRow.description);

        this._dataService.get(Global.BASE_USER_ENDPOINT + "ProductMaster/GetProductPicturebyId/" + this.productId).subscribe(res => {
          if (res.isSuccess) {
            if (res.data.length > 0) {
              this.url = [
                { img: res.data[0] != null ? Global.BASE_IMAGES_PATH + res.data[0].name : "assets/images/user.png" },
                { img: res.data[1] != null ? Global.BASE_IMAGES_PATH + res.data[1].name : "assets/images/user.png" },
                { img: res.data[2] != null ? Global.BASE_IMAGES_PATH + res.data[2].name : "assets/images/user.png" },
                { img: res.data[3] != null ? Global.BASE_IMAGES_PATH + res.data[3].name : "assets/images/user.png" },
                { img: res.data[4] != null ? Global.BASE_IMAGES_PATH + res.data[4].name : "assets/images/user.png" },
              ];
            }
          } else {
            this._toastr.error(res.errors[0], "Product Master");
          }
        });


      } else {
        this._toastr.error(res.errors[0], "Product Master");
      }
    });

    //fill images when edit the record
    //this.url = [];
  }
  getUserType() {
    this._dataService.get(Global.BASE_USER_ENDPOINT + "UserType/GetAll").subscribe(res => {
      if (res.isSuccess) {
        this.objUserTypes = res.data;
      } else {
        this._toastr.error(res.errors[0], "Product Master");
      }
    });
  }

  getSizes() {
    this._dataService.get(Global.BASE_USER_ENDPOINT + "SizeMaster/GetAll").subscribe(res => {
      if (res.isSuccess) {
        this.objSizes = res.data;
      } else {
        this._toastr.error(res.errors[0], "Product Master");
      }
    });
  }
  getCategories() {
    this._dataService.get(Global.BASE_USER_ENDPOINT + "Category/GetAll").subscribe(res => {
      if (res.isSuccess) {
        this.objCategories = res.data;
      } else {
        this._toastr.error(res.errors[0], "Product Master");
      }
    });
  }
  getTags() {
    this._dataService.get(Global.BASE_USER_ENDPOINT + "TagMaster/GetAll").subscribe(res => {
      if (res.isSuccess) {
        this.objTags = res.data;
      } else {
        this._toastr.error(res.errors[0], "Product Master");
      }
    });
  }
  getColors() {
    this._dataService.get(Global.BASE_USER_ENDPOINT + "ColorMaster/GetAll").subscribe(res => {
      if (res.isSuccess) {
        this.objColors = res.data;
      } else {
        this._toastr.error(res.errors[0], "Product Master");
      }
    });
  }

  cancelForm() {
    this.dbops = DbOperation.create;
    this.buttonText = "Add";
    if (this.productForm.value != null) {
      this.setFormState();
    }
  }

  increment() {
    // this.counter += 1;
    this.counter = this.counter + 1;
    this.productForm.controls['quantity'].setValue(this.counter);
  }

  decrement() {
    // this.counter -= 1;
    this.counter = this.counter - 1;
    this.productForm.controls['quantity'].setValue(this.counter);
  }

  readUrl(event: any, i: number) {
    if (event.target.files.length === 0) {
      return;
    }

    this.fileTobeUpload[i] = event.target.files[0];
    let type = event.target.files[0].type;
    if (type.match(/image\/*/) == null) {
      this.elfiles.nativeElement.value = "";
      this._toastr.error("Only Images are supported !!", "Product master");
      return;
    }

    //Image Upload
    let reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    reader.onload = (event) => {
      this.url[i].img = reader.result.toString();
    };
  }

  onSubmit() {
    this.submitted = true;
    if ((!this.productId || this.productId === 0) && this.fileTobeUpload.length < 5) {
      this._toastr.error("Please Upload 5 Images per product !!", "Product Master");
      return;
    }

    const formData = new FormData();
    formData.append('Id', this.productForm.controls['Id'].value);
    formData.append('Name', this.productForm.controls['name'].value);
    formData.append('Title', this.productForm.controls['title'].value);
    formData.append('Code', this.productForm.controls['code'].value);
    formData.append('Price', this.productForm.controls['price'].value);
    formData.append('SalePrice', this.productForm.controls['salePrice'].value);
    formData.append('Discount', this.productForm.controls['discount'].value);
    formData.append('CategoryId', this.productForm.controls['categoryId'].value);
    formData.append('TagId', this.productForm.controls['tagId'].value);
    formData.append('SizeId', this.productForm.controls['sizeId'].value);
    formData.append('ColorId', this.productForm.controls['colorId'].value);
    formData.append('Quantity', this.productForm.controls['quantity'].value);
    formData.append('IsSale', this.productForm.controls['isSale'].value);
    formData.append('IsNew', this.productForm.controls['isNew'].value);
    formData.append('ShortDetails', this.productForm.controls['shortDetails'].value);
    formData.append('Description', this.productForm.controls['description'].value);


    if (this.fileTobeUpload) {
      for (let i = 1; i <= this.fileTobeUpload.length; i++) {
        let ToUpload = this.fileTobeUpload[i - 1];
        formData.append("Image", ToUpload, ToUpload.name);
      }
    }

    switch (this.dbops) {
      case DbOperation.create:
        this.productForm.controls["Id"].setValue(0);
        this._dataService.postImages(Global.BASE_USER_ENDPOINT + "ProductMaster/Save/", formData).subscribe(res => {
          debugger;
          if (res.isSuccess) {
            this._toastr.success("Data saved successfully !!", "Product Master");
            this.navRoute.navigate(['products/physical/product-list']);
            this.cancelForm();
          } else {
            this._toastr.info(res.errors[0], "Product Master");
          }
        });
        break;
      case DbOperation.update:
        this._dataService.postImages(Global.BASE_USER_ENDPOINT + "ProductMaster/Update/", formData).subscribe(res => {
          if (res.isSuccess) {
            this._toastr.success("Data updated successfully !!", "Product Master");
            this.navRoute.navigate(['products/physical/product-list']);
            this.cancelForm();
          } else {
            this._toastr.info(res.errors[0], "Product Master");
          }
        });
        break;
    }
  }

  ngOnDestroy() {
    this.objRow = null;
    this.objCategories = null;
    this.objColors = null;
    this.objSizes = null;
    this.objTags = null;
    this.objUserTypes = null;
  }

}
