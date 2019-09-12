import { Component, OnInit } from '@angular/core';
import { ImagesService } from '../services/images.service';
import { takeUntil } from 'rxjs/internal/operators/takeUntil';
import { Subject } from 'rxjs/internal/Subject';
import * as fileSaver from 'file-saver';
import { ToastrService } from 'ngx-toastr';
import { DialogService } from 'src/app/shared/services/dialog.service';

@Component({
  selector: 'app-image-list',
  templateUrl: './image-list.component.html',
  styleUrls: ['./image-list.component.css']
})
export class ImageListComponent implements OnInit {
  images = [];
  private destroy$: Subject<boolean> = new Subject<boolean>();
  fileUpload: any;
  p: number = 1;
  constructor(private api: ImagesService,
    private toastr: ToastrService,
    private dialogService: DialogService) { }

  ngOnInit() {
    this.getAllImages();
  }

  getAllImages() {
    this.api.getAllImages()
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: any) => {
        this.images = res;
      });
  }

  insertNewImg(files: any) {
    if (this.fileValid(files[0])) {
      let formData: FormData = new FormData();
      formData.append("model", files[0], files[0].name);
      let fileToUpload = formData;

      if (fileToUpload == undefined) {
        return false;
      }
      else {
        this.api.insertNewImg(formData)
          .pipe(takeUntil(this.destroy$))
          .subscribe((res: any) => {
            this.fileUpload = '';
            if (res == true) {
              this.toastr.success("Image added successfully", 'Success');
              this.getAllImages();
            }
            else {
              this.toastr.error("Error occured!", 'Error');
            }
          });
      }
    }
  }

  downloadImg(fileName) {
    this.api.downloadImg(fileName)
      .pipe(takeUntil(this.destroy$))
      .subscribe((result: any) => {
        if (result.type != 'text/plain') {
          var blob = new Blob([result]);
          let saveAs = require('file-saver');
          let file = fileName;
          saveAs(blob, file);
          this.toastr.success("Image downloaded successfully", 'Success');
        }
        else {
          this.toastr.error("File not found!", 'Error');
        }
      });
  }

  deleteImg(fileName) {
    this.dialogService.openConfirmDialog('Are you sure want to delete this file?')
      .afterClosed().subscribe((res: any) => {
        if (res) {
          this.api.deleteImg(fileName)
            .pipe(takeUntil(this.destroy$))
            .subscribe((res: any) => {
              if (res == true) {
                this.toastr.success("Image deleted", 'Success');
                this.getAllImages();
              }
              else {
                this.toastr.error("Error occured!", 'Error');
              }
            });
        }
      });
  }

  deleteAllImgs() {
    this.dialogService.openConfirmDialog('Are you sure want to delete all files?')
      .afterClosed().subscribe((res: any) => {
        if (res) {
          this.api.deleteAllImgs()
            .pipe(takeUntil(this.destroy$))
            .subscribe((res: any) => {
              if (res == true) {
                this.toastr.success("All photos have been deleted", 'Success');
                this.getAllImages();
              }
              else {
                this.toastr.error("Error occured!", 'Error');
              }
            });
        }
      });
  }

  fileExtensionError;
  fileSizeError;
  fileValid(file: any) {
    var allowedExtensions = ['jpg', 'jpeg', 'png', 'JPG', 'JPEG'];
    var fileExtension = file.name.split('.').pop();

    if (this.isInArray(allowedExtensions, fileExtension)) {
      this.fileExtensionError = false;
    } else {
      this.fileExtensionError = true;
    }

    if (file.size / 1000 > 900) {
      this.fileSizeError = true;
    } else {
      this.fileSizeError = false;
    }

    if (file && !this.fileExtensionError && !this.fileSizeError) {
      return true;
    }

    return false;
  }

  isInArray(array, word) {
    return array.indexOf(word.toLowerCase()) > -1;
  }
}
