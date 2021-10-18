import { Component, Input, OnInit } from '@angular/core';
import { Item } from 'src/app/models/item';
import { ItemListComponent } from '../item-list/item-list.component';

@Component({
  selector: 'item-preview',
  templateUrl: './item-preview.component.html',
  styleUrls: ['./item-preview.component.scss'],
})
export class ItemPreviewComponent implements OnInit {
  @Input() item: Item | null = null; //gets from father component : item-list
  img = "https://random.imagecdn.app/500/150"
  constructor(private itemList: ItemListComponent) {
    
  }

  ngOnInit(): void {}
}
