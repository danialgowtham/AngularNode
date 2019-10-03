import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { EmployeeSkillMappingService } from "../services/employee_skill_mapping.service";
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { MatDialog } from '@angular/material'; 
import { RedirectService } from "../services/redirect";
import * as XLSX from 'xlsx';
 

@Component({
  selector: 'app-internal-job-post',
  templateUrl: './internal-job-post.component.html',
  styleUrls: ['./internal-job-post.component.css']
})
export class InternalJobPostComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('TABLE') table: ElementRef;

  job_detail: any;
  employee_detail: any;
  displayedColumns: string[] = ['role', 'created_by', 'created_on', 'status', 'action'];
  constructor(private redirect: RedirectService,  private skill_service: EmployeeSkillMappingService, public dialog: MatDialog) { }

  ngOnInit() {
    this.skill_service.getJobPost()
      .subscribe(
        response => {
          this.job_detail = new MatTableDataSource(response["data"]['internal_job_list']);
          this.employee_detail = response["data"]['employee_detail'];
          setTimeout(() => this.job_detail.paginator = this.paginator);
        }
      )

  }
  applyFilter(filterValue: string) {
    this.job_detail.filter = filterValue.trim().toLowerCase();
  }
 
  redirectPage(page_link, job_id) {
    this.redirect.change_page_with_data(page_link, { job_id });
  }

  ngOnDestroy() {
    this.dialog.closeAll();
  }

  ExportTOExcel() {
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(this.table.nativeElement);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    let range = XLSX.utils.decode_range(ws["!ref"]);
    
    for (var R = range.s.r; R <= range.e.r; ++R) {
      var cell_index= Number(R)+1;
      delete ws['E' + cell_index].v;
    }
    XLSX.utils.book_append_sheet(wb, ws, 'Job Post List');

    /* save to file */
    XLSX.writeFile(wb, 'Job Post List ' + new Date() + '.xlsx');

  }
}
