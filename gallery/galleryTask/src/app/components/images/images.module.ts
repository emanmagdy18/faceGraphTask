import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageListComponent } from './image-list/image-list.component';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';

@NgModule({
  declarations: [
    ImageListComponent
  ],
  imports: [
    CommonModule,
    NgxPaginationModule,
    FormsModule
  ]
})
export class ImagesModule { }
