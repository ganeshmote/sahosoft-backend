import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/shared/services/data.service';
import { ToastrService } from 'ngx-toastr';
import { Global } from 'src/app/shared/global';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {

  orders: [];

  constructor(private _dataService: DataService, private _toastr: ToastrService) { }

  settings = {
    actions: true,
    hideSubHeader: false,
    columns: {
      orderId: {
        title: "Order Id", filter: true
      },
      paymentStatus: {
        title: "Payment Status", filter: true, type: 'html'
      },
      paymentMethod: {
        title: "Payment Method", filter: true
      },
      paymentDate: {
        title: "Payment Date", filter: true
      },
      orderStatus: {
        title: "Order Status", filter: true, type: 'html'
      },
      subTotalAmount: {
        title: "SubTotal Amount", filter: true
      },
      shippingAmount: {
        title: "Shipping Amount", filter: true
      },
      totalAmount: {
        title: "Toptal Amount", filter: true
      }
    }
  };

  ngOnInit(): void {
    this.getData();
  }

  getData() {
    this._dataService.get(Global.BASE_USER_ENDPOINT + "PaymentMaster/GetReportManageOrder").subscribe(res => {
      if (res.isSuccess) {
        this.orders = res.data;
      } else {
        this._toastr.error(res.errors[0], "Dashboard");
      }
    });
  }

}
