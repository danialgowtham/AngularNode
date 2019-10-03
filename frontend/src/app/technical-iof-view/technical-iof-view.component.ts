import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import * as jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-technical-iof-view',
  templateUrl: './technical-iof-view.component.html',
  styleUrls: ['./technical-iof-view.component.css']
})
export class TechnicalIofViewComponent implements OnInit {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<TechnicalIofViewComponent>) { }

  ngOnInit() {

  }
  closeDialog() {
    this.dialogRef.close();
  }
  // getBase64Image(img) {
  //   var canvas = document.createElement("canvas");
  //   canvas.width = img.width;
  //   canvas.height = img.height;
  //   var ctx = canvas.getContext("2d");
  //   ctx.drawImage(img, 0, 0);
  //   var dataURL = canvas.toDataURL("image/png");
  //   console.log(dataURL);
  //   return dataURL;
  // }
  public captureScreen() {
    // html2canvas(document.getElementById('contentToConvert')).then(function (canvas) {
    //   var img = canvas.toDataURL("image/png");
    //   var imgWidth = 208;
    //   var imgHeight = canvas.height * imgWidth / canvas.width;
    //   var doc = new jsPDF('p', 'mm', 'a4');
    //   var position = 0;
    //   doc.addImage(img, 'PNG', 0, position, imgWidth, imgHeight)
    //   doc.save('Resume.pdf');
    // });
    var scaleBy = 5;
    var w = 1000;
    var h = 1000;
    var div = document.querySelector('#screen');
    var canvas = document.createElement('canvas');
    canvas.width = w * scaleBy;
    canvas.height = h * scaleBy;
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    var context = canvas.getContext('2d');
    context.scale(scaleBy, scaleBy);

    html2canvas(document.getElementById('contentToConvert'), { scale: 2 }).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      // Few necessary setting options
      const imgWidth = 208;
      const pageHeight = 295;
      const imgHeight = canvas.height * imgWidth / canvas.width;
      const doc = new jsPDF('p', 'mm', 'a4');
      let heightLeft = imgHeight;
      let position = 10;
      doc.text(10, 15, "Interview Observation Form");
      doc.addImage(imgData, 'PNG', 10, 20, imgWidth - 15, imgHeight);
      heightLeft -= pageHeight;
      var d = new Date();
      var n = d.toLocaleDateString();
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        doc.addPage();
        doc.addImage(imgData, 'PNG', 10, position, imgWidth - 15, imgHeight);
        heightLeft -= pageHeight;
      }
      // Generated PDF
      doc.save('IOF' + '.pdf');
    });
  }


}
