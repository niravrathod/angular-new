import { Component, OnInit, Inject, ViewChild,ViewEncapsulation } from '@angular/core';
import { sampleData } from './jsontreegriddata';
import { TreeGridComponent,FreezeService} from '@syncfusion/ej2-angular-treegrid';
import { getValue, isNullOrUndefined } from '@syncfusion/ej2-base';
import { BeforeOpenCloseEventArgs } from '@syncfusion/ej2-inputs';
import { MenuEventArgs } from '@syncfusion/ej2-navigations';
import { DialogComponent, ButtonPropsModel, DialogUtility } from '@syncfusion/ej2-angular-popups';
import { DateRangePickerComponent } from '@syncfusion/ej2-angular-calendars';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ButtonComponent } from '@syncfusion/ej2-angular-buttons';
import { FormsModule } from '@angular/forms';
import * as uuid from 'uuid';
@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    encapsulation: ViewEncapsulation.None,
    providers: [ FreezeService ]
})
export class AppComponent implements OnInit {
    public data: Object[] = [];
    @ViewChild('alertDialog')
    public alertDialog: DialogComponent;
    @ViewChild('treegrid')
    public treegrid: TreeGridComponent;
    public treegridColumns: any;
    @ViewChild('newcolumnDialog')
    public newcolumnDialog: DialogComponent;
    public content: string = 'Atleast one Column should be in movable';
    public header: string = 'Frozen';
    public visible: boolean = false;
    public animationSettings: object = { effect: 'None' };
    public showCloseIcon: boolean = false;
    public freezed: boolean = false;
    public target: string = '.control-section';
    public width: string = '300px';
    public contextMenuItems: Object;

    public len : Number = 0;
    public f_name : String = '';

    //new-column
    public new_column_header: string = 'Add New Column';
    public new_column_visible: boolean = false;
    public new_column_animationSettings: object = { effect: 'None' };
    public new_column_showCloseIcon: boolean = true;
    public new_column_target: string = '.control-section';
    public new_column_width: string = '450px';
    public alignment: string[] = [
      'Center', 'Left', 'Right'
  ];
    public data_type: string[] = [
        'Text', 'Number', 'Date',
        'Boolean' , 'Drop Down List'
    ];
    private data_type_json: object[] = {
        "Text":"stringedit", 'Number':"numericedit", 'Date':"dateedit",
        'Boolean':"booleanedit" , 'Drop Down List':"dropdownedit"
    };

    public new_column_text: boolean = false;
    public new_column_number: boolean = false;
    public new_column_bool: boolean = false;
    public new_column_date: boolean = false;
    public new_column_list: boolean = false;

    // new_column_form: FormGroup;
    
    // constructor(
    //     private formBuilder: FormBuilder
      
    // ) {}
    ngOnInit(): void {
        // this.new_column_form = this.formBuilder.group({
        //     column_name: '',
        // });
        this.data = sampleData;
        this.contextMenuItems= [
            {text: 'Collapse the Row', target: '.e-content', id: 'collapserow'},
            {text: 'Expand the Row', target: '.e-content', id: 'expandrow'},
            { text: 'Collapse All', target: '.e-headercontent', id: 'collapseall' },
            { text: 'Expand All', target: '.e-headercontent', id: 'expandall' },
            { text: 'Add New Column', target: '.e-headercontent', id: 'add_column' },
            { text: 'Freeze Left', target: '.e-headercontent', id: 'freezeleft' }
         ]
    }
    ngAfterViewInit(){
          this.treegridColumns = [{ field: "taskID", isPrimaryKey: "true", headerText: "Task ID", width: "90" },
        { field: "taskName", headerText: "Task Name", width: "200"},
        { field: "startDate", headerText: "Start Date", width: "100",format:"yMd"},
        { field: "endDate", headerText: "End Date", width: "100",format:"yMd"},
        { field: "progress", headerText: "Progress", width: "100"},
        { field: "duration", headerText: "Duration", width: "100"},
        { field: "priority", headerText: "Priority", width: "100"},
      ];
        // { headerText: "taskName", width: "90", template: this.temp1}];
        
    }
    closeNewCol(): void {
      this.newcolumnDialog.hide();   
    }
    contextMenuOpen (arg?: BeforeOpenCloseEventArgs): void {
        let elem: Element = arg.event.target as Element;
        let row: Element = elem.closest('.e-row');
        let uid: string = row && row.getAttribute('data-uid');
        let items: Array<HTMLElement> = [].slice.call(document.querySelectorAll('.e-menu-item'));
        for (let i: number = 0; i < items.length; i++) {
          items[i].setAttribute('style','display: none;');
        }
        if (elem.closest('.e-row')) {
          if ( isNullOrUndefined(uid) || 
            isNullOrUndefined(getValue('hasChildRecords', this.treegrid.grid.getRowObjectFromUID(uid).data))) {
            arg.cancel = true;
          } else {
            let flag: boolean = getValue('expanded', this.treegrid.grid.getRowObjectFromUID(uid).data);
            let val: string = flag ? 'none' : 'block';
            document.querySelectorAll('li#expandrow')[0].setAttribute('style', 'display: ' + val + ';');
            val = !flag ? 'none' : 'block';
            document.querySelectorAll('li#collapserow')[0].setAttribute('style', 'display: ' + val + ';');
          }
        } else {
          let len = this.treegrid.element.querySelectorAll('.e-treegridexpand').length;
          document.querySelectorAll('li#add_column')[0].setAttribute('style', 'display: block;');

          if (len !== 0) {
            document.querySelectorAll('li#collapseall')[0].setAttribute('style', 'display: block;');
            document.querySelectorAll('li#freezeleft')[0].setAttribute('style', 'display: block;');
          } else {
            document.querySelectorAll('li#expandall')[0].setAttribute('style', 'display: block;');
            document.querySelectorAll('li#freezeleft')[0].setAttribute('style', 'display: block;');
          }
        }
    }
    newcolumnonChange(args): void {
      console.log(args);
      // let necolumn: HTML
      switch(args.value){
        case 'Text':
          this.new_column_number = false;   
          this.new_column_bool = false;  
          this.new_column_date = false;   
          this.new_column_list = false;   
          this.new_column_text = true;
          break;
        case 'Number':
          this.new_column_text = false;   
          this.new_column_bool = false; 
          this.new_column_date = false;   
          this.new_column_list = false;   
          this.new_column_number = true;   
          break;
        case 'Boolean':
          this.new_column_text = false;   
          this.new_column_number = false;   
          this.new_column_date = false;   
          this.new_column_list = false;   
          this.new_column_bool = true;   
          break;
        case 'Date':
          this.new_column_text = false;   
          this.new_column_number = false;   
          this.new_column_bool = false;   
          this.new_column_list = false;   
          this.new_column_date = true;   
          break;
        case 'Drop Down List':
          this.new_column_text = false;   
          this.new_column_number = false;   
          this.new_column_bool = false;   
          this.new_column_date = false;   
          this.new_column_list = true;   
          break;
      }
        // let element: HTMLElement = document.createElement('p');
        // if (args.isInteracted) {
        //     element.innerText = 'Changes happened by Interaction';
        // } else {
        //     element.innerText = 'Changes happened by programmatic';
        // }
        // document.getElementById('event').append(element);
    }
    contextMenuClick (args?: MenuEventArgs): void {
        if (args.item.id === 'collapserow') {
          this.treegrid.collapseRow(this.treegrid.getSelectedRows()[0] as HTMLTableRowElement, this.treegrid.getSelectedRecords()[0]);
        } else if (args.item.id === 'expandrow') {
          this.treegrid.expandRow(this.treegrid.getSelectedRows()[0] as HTMLTableRowElement, this.treegrid.getSelectedRecords()[0]);
        } else if (args.item.id === 'collapseall') {
          this.treegrid.collapseAll();
        } else if (args.item.id === 'expandall') {
          this.treegrid.expandAll();
        } else if (args.item.id === 'freezeleft') {
          if(args.column.field != null && args.column.field!==undefined)
          {
            for(var i=0;i<this.treegrid.getColumnFieldNames().length;i++)
            {
              if(args.column.field == this.treegrid.getColumnFieldNames()[i] && i == this.treegrid.getColumnFieldNames().length-1)
              {
                //last-column prevent to freeze left
                this.freezed = false;
                this.alertDialog.show();   
                break;
              }
              else if(args.column.field == this.treegrid.getColumnFieldNames()[i])
              {
                if(this.treegrid.getColumnByField(this.treegrid.getColumnFieldNames()[i]).index==0)
                {
                this.freezed = false;
                  this.treegrid.getColumnByField(args.column.field).freeze = 'Left'; 
                  this.treegrid.refreshColumns();
                }
                else
                {
                  this.freezed = true;
                }
              }
            }

            if(this.freezed==true)
            {
                this.len = args.column.index;
                for(var i=0;i<=this.len;i++)
                {
                  this.treegrid.getColumnByField(this.treegrid.getColumnFieldNames()[i]).freeze = 'Left';
          
                }
              this.treegrid.refreshColumns();

            }
          }
        } else if (args.item.id === 'add_column'){
          // this.createForm();
          this.newcolumnDialog.show(); 
          // add() {

            //add new column dialog popup 
            // Pop up -> 
            // column_name*,
            // data_type*(text,num,date,boolean,dropdownlist),
            // default_value*,
            // non-blank(checkbox-true/false),
            // minimum_column_width*(when screen shrank),
            // font_size*,
            // font_color*,
            // background_color*,
            // alignment*,
            // text_wrap(checkbox-true/false),



            // var obj = { field: "ShipCity", headerText: 'NewColumn', width: 120 };
            // this.treegrid.columns.push(obj as any);   //you can add the columns by using the Grid columns method
            // this.treegrid.refreshColumns();
       
          //  }
        }
    }

    addNewCol(new_col_form) {
      console.log(new_col_form)
//         if(this.treegrid.getColumnFieldNames().includes(new_col_form.value.column_name))
//         {
//           // alert('Invalid name');
//           // onOpenDialog = function(event: any): void {
//             // }
//             // new_col_form.status = "INVALID";
//             // new_col_form.controls.column_name.status = "INVALID";
//             // setTimeout(()=>{
//               // DialogUtility.alert('This is an Alert Dialog!');
// //               const zIndex = 1040 + 10 * document.querySelectorAll('.modal').length;
// // console.log(zIndex);
//     // $(this).css('z-index', zIndex);
//     // setTimeout(() => $('.modal-backdrop').not('.modal-stack').css('z-index', zIndex - 1).addClass('modal-stack'));
//               DialogUtility.alert({
//                 title: 'Already Exist!',
//                 content: "Column Name Already Exist!,Please Try Another Column Name!",
//                 zIndex: 1200,
//                 showCloseIcon: true,
//                 closeOnEscape: true,
//                 animationSettings: { effect: 'Zoom' }
//             });
//             // },1000);
//           return false;
//         }
        // DefaultValue=1000
        var obj = { DefaultValue:new_col_form.value.default_value,field: uuid.v4(), headerText: new_col_form.value.column_name, edittype: this.data_type_json[new_col_form.value.data_type],width: 120 };
        this.treegrid.columns.push(obj as any);   //you can add the columns by using the Grid columns method
        this.treegrid.refreshColumns();
        this.newcolumnDialog.hide(); 
        DialogUtility.alert({
            title: 'Success',
            content: "Column Added Sucessfully!",
            // zIndex: 1200,
            showCloseIcon: true,
            closeOnEscape: true,
            animationSettings: { effect: 'Zoom' }
        });


    }

    public alertDialogBtnClick = (): void => {
        this.alertDialog.hide();
    }

    public dlgButtons: ButtonPropsModel[] = [{ click: this.alertDialogBtnClick.bind(this), buttonModel: { content: 'OK', isPrimary: true } }];
}
