import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import {Location} from '@angular/common';


import { Subscription } from "rxjs/Rx";
import { MessageService } from '../../service/message.service';
import * as mGlobal from '../../global-variables';
import {b} from '@angular/core/src/render3';  //전역변수


@Component({
  selector: 'app-headmenu',
  templateUrl: './headmenu.component.html',
  styleUrls: ['./headmenu.component.css']
})
export class HeadmenuComponent implements OnInit, OnDestroy {

  test;

  message: any;
  subscription: Subscription;
  isMenuOpen:boolean;

  menuVisible:boolean = true;

  constructor(private messageService: MessageService,
              private router: Router,
              private location: Location) {

    //message 테스트
    this.subscription = this.messageService.getMessage().subscribe(message => {
      this.message = message;
    });
  }

  ngOnInit() {
    this.isMenuOpen = false;

    //상단메뉴가 보일지를 결정
    this.subscription = this.messageService.getMenuState().subscribe(data => {
      this.menuVisible = data.visible;
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onClick_menu(){
    console.log("메뉴");
    if(this.isMenuOpen){
      this.isMenuOpen=false;
      this.location.back();
    }else{
      this.isMenuOpen=true;
      this.router.navigate(['/menu']);
    }
  }




  }
