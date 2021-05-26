import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/shared/services/data.service';
import { ToastrService } from 'ngx-toastr';
import { Global } from 'src/app/shared/global';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss']
})
export class TransactionsComponent implements OnInit {

  transactions: any;

  constructor(private _dataService: DataService, private _toastr: ToastrService) { }

  settings = {
    actions: true,
    hideSubHeader: false,
    columns: {
      transactionId: {
        title: "Transaction Id", filter: true
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
    this._dataService.get(Global.BASE_USER_ENDPOINT + "PaymentMaster/GetReportTransactionDetails").subscribe(res => {
      if (res.isSuccess) {
        this.transactions = res.data;
      } else {
        this._toastr.error(res.errors[0], "Dashboard");
      }
    });
  }

}