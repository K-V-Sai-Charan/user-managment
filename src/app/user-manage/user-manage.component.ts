import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AgGridAngular } from 'ag-grid-angular';
import { CellClickedEvent, GridApi } from 'ag-grid-community';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-user-manage',
  templateUrl: './user-manage.component.html',
  styleUrls: ['./user-manage.component.css']
})
export class UserManageComponent implements OnInit {

  @ViewChild(AgGridAngular) agGrid! : AgGridAngular;
  rowData: any = [];
  data: any;
  isChecked: boolean = true;
  gridAPI!: GridApi;
  show: boolean = false;
  closeResult!: string;
  selectedData: any;

  columnDefs = [
    {headerName: '', cellRenderer: this.imageRender,  filter: false, sortable: false, checkboxSelection: true},
    {field : 'UserID'},
    {field : 'FirstName'},
    {field : 'Phone'},
    {field : 'Type'}
  ]

  defaultColDef = {
    filter: true, sortable: true, resizable: true
  }

  constructor(private http: HttpClient, private modalService: NgbModal) {}

  ngOnInit(): void {}

  imageRender(){
    let div = document.createElement('div');
    div.innerHTML = '<img src="../../assets/imgs/images.png" height="35" width="35"/> ';
    return div;
  }

  getSelectedRowData(event:any){
    this.selectedData = this.gridAPI.getSelectedRows();
    console.log('selectedData', this.selectedData);
    return this.selectedData;
  }

  onGridReady(params: any){
    this.gridAPI = params.api;
    this.http.get('http://localhost:3000/users').subscribe(res=>{
      this.rowData = res;
    })
  }


  open(content:any) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  }

  onCheckedChange(item: any, data: any, x: any){
    // console.log('roleFunctionArray',data)
    // console.log('item',item)
    let currentRoleFunction = data.find((res: any) => {return res.FunctionID == x.FunctionID})
    // console.log('cRF',currentRoleFunction)

    let index = data.indexOf(currentRoleFunction)

    const resultedData = currentRoleFunction.Active == 1? currentRoleFunction.Active=0 : currentRoleFunction.Active=1

    item.RoleFunctionArray[index].Active = resultedData
    this.http.put<any>('http://localhost:3000/users/' + item.UserID , item).subscribe((result)=>{
      console.log(result)
    })
  }

}


