import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/shared/services/data.service';
import { ToastrService } from 'ngx-toastr';
import { Global } from 'src/app/shared/global';
import * as chartData from '../../shared/data/chart';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  orders = [];
  lineChartOptions: any;
  lineChartColors: any;
  lineChartLegend: any;
  lineChartType: any;
  lineChartData = [];
  lineChartLabels: any;

  varorders: number;
  varshipAmt: number;
  varcashOnDelivery: number;
  varcancelled: number;
  isShowOrderStatus: boolean = false;
  statusChart: string = "";

  constructor(private _dataService: DataService, private _toastr: ToastrService) { }

  settings = {
    actions: true,
    hideSubHeader: true,
    columns: {
      orderId: {
        title: "Order Id", filter: false
      },
      orderStatus: {
        title: "Order Status", filter: false, type: 'html'
      },
      paymentMethod: {
        title: "Payment Method", filter: false
      },
      paymentDate: {
        title: "Payment Date", filter: false
      },
      totalAmount: {
        title: "Toptal Amount", filter: false
      }
    }
  };

  ngOnInit(): void {
    this.getData();
    this.getNetFigure();
    this.OrderStatus();
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

  getNetFigure() {
    this._dataService.get(Global.BASE_USER_ENDPOINT + "PaymentMaster/GetReportNetFigure").subscribe(res => {
      if (res.isSuccess) {
        this.varorders = res.data[0].orders;
        this.varshipAmt = res.data[0].shippingAmount;
        this.varcashOnDelivery = res.data[0].cashOnDelivery;
        this.varcancelled = res.data[0].cancelled;
      } else {
        this._toastr.error(res.errors[0], "Dashboard");
      }
    });
  }

  OrderStatus() {
    // this.lineChartOptions = chartData.lineChartOptions
    // this.lineChartColors = chartData.lineChartColors
    // this.lineChartLegend = chartData.lineChartLegend
    // this.lineChartType = chartData.lineChartType

    // this.lineChartData = [
    //   { data: [1, 1, 2, 1, 2, 2] },
    //   { data: [0, 1, 1, 2, 1, 1] },
    //   { data: [0, 1, 0, 1, 2, 1] },
    //   { data: [1, 2, 3, 2, 1, 3] }
    // ];

    // this.lineChartLabels = ["1 min.", "10 min." ,"20 min","30 min.","40 min.","50 min."];
    // this.isShowOrderStatus = true;

    this.isShowOrderStatus = false;
    let objLineChartData = {};
    let arr = [];
    this._dataService.get(Global.BASE_USER_ENDPOINT + "PaymentMaster/GetChartOrderStatus").subscribe(res => {
      if (res.isSuccess) {
        let allData = res.data;
        debugger;
        //counts: 1 ,  date: "22-12-2019" ,  orderStatus: "Cancelled"
        this.lineChartLabels = allData.map(item => item.date).filter((value, index, self) => self.indexOf(value) === index);
        let allOrderStatus = allData.map(item => item.orderStatus).filter((value, index, self) => self.indexOf(value) === index);
        let varStr = "";
        debugger;
        for (let status in allOrderStatus) {
          varStr = varStr + " / " + allOrderStatus[status];
          arr = [];
          for (let date in this.lineChartLabels) {
            for (let data in allData) {
              if (allOrderStatus[status] == allData[data].orderStatus && this.lineChartLabels[date] == allData[data].date) {
                arr[arr.length] = allData[data].counts
              }
            }
          }
          objLineChartData = { data: arr };
          this.lineChartData[this.lineChartData.length] = objLineChartData;
          this.isShowOrderStatus = true;
        }

        this.statusChart = varStr.replace('/', '');
        this.lineChartOptions = chartData.lineChartOptions
        this.lineChartColors = chartData.lineChartColors
        this.lineChartLegend = chartData.lineChartLegend
        this.lineChartType = chartData.lineChartType
      } else {
        this._toastr.error(res.errors[0], "Dashboard");
      }
    });
  }
}
