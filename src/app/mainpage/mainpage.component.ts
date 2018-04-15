import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';

import { PostTestService } from '../service/post-test.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MessageService } from '../service/message.service';

// [model]
import { SoundData } from '../model/sound-list';
import { SoundListDetail } from '../model/sound-list-detail';

import * as mGlobal from '../global-variables';  //전역변수


@Component({
  selector: 'app-mainpage',
  templateUrl: './mainpage.component.html',
  styleUrls: ['./mainpage.component.css'],
})




export class MainpageComponent implements OnInit {

  soundData: SoundData;
  globalValue;
  btnClicked:boolean;
  soundCount;
  artworkPath:string;

  playImg;


  constructor( private postTestService: PostTestService,
               private http: HttpClient,
               private messageService: MessageService,
               private router: Router,){

  }


  sendMessage(): void {
    this.messageService.sendMessage('오지고 지리고 렛잇고');
  }

  sendMusicInfo(): void {
    this.messageService.sendMusicInfo(11, "노래이름", "비트메이커", "경로");
  }

  clearMessage(): void {
      this.messageService.clearMessage();
  }


  ngOnInit(){
    console.log("main Init");
    this.globalValue = mGlobal.ServerPath;

    this.playImg = "assets/circle-play.png";
    this.artworkPath = mGlobal.ArtworkPath;
    this.soundCount=0;
    this.postSoundList();
  }


  onClick_test(){
    console.log("회색클릭");
    // this.sendMessage();
    this.sendMusicInfo();
  }


  postSoundList(){
    var path = '/sound_list';
    var token = 0;

    //로그인상태이면 토큰을 보내고 아니면 0을 보냄
    if (localStorage.getItem('auth')) {
        var auth = JSON.parse(localStorage.getItem('auth'));
        token = auth.token;
    }

    var postData = {token:token};
    this.postTestService.postServer(path, postData).subscribe(data => {
      this.soundData = data;
      this.applyArtworkPath(); //이미지경로에 서버위치 붙여주기


      //전체 음원개수
      this.soundCount = this.soundData.sound_list.length +
                        this.soundData.sound_recommend_list.length;
    });
  }


  //이미지 경로를 완성시켜줌
  applyArtworkPath(){

    for(var i=0; i<this.soundData.sound_list.length; i++){
      this.soundData.sound_list[i].img_path
      = mGlobal.ArtworkPath + "/" + this.soundData.sound_list[i].img_path;
    }

    for(var i=0; i<this.soundData.sound_recommend_list.length; i++){
      this.soundData.sound_recommend_list[i].img_path
      = mGlobal.ArtworkPath + "/" + this.soundData.sound_recommend_list[i].img_path;
    }

  }


  //상단의 추천 5개음악 재생
  onClick_startRecommendMusic(soundIndex: number){
    // console.log("누른번호:" + soundIndex);

    var playSound = this.soundData.sound_recommend_list[soundIndex];
    var soundPk = playSound.sound_pk;
    var soundName = playSound.sound_name;
    var beatmakerNickname = playSound.beatmaker_nickname;
    var soundPath = playSound.sound_path;

    this.messageService.sendMusicInfo(soundPk, soundName, beatmakerNickname, soundPath);
  }


  //전체 음악 재생
  onClick_startMusic(soundIndex: number){
    // console.log("누른번호:" + soundIndex);
    var playSound = this.soundData.sound_list[soundIndex];
    var soundPk = playSound.sound_pk;
    var soundName = playSound.sound_name;
    var beatmakerNickname = playSound.beatmaker_nickname;
    var soundPath = playSound.sound_path;

    this.messageService.sendMusicInfo(soundPk, soundName, beatmakerNickname, soundPath);
  }


  //추천곡 좋아요
  onClick_recommend_like(sound_pk, index){
    if (localStorage.getItem('auth')) {
          this.soundData.sound_recommend_list[index].like_my = 1;
          this.postUserLike(sound_pk, +1);
    }else{
      this.router.navigate(['/login']);
    }

  }

  //추천곡 좋아요 취소
  onClick_recommend_dislike(sound_pk, index){
    if (localStorage.getItem('auth')) {
          this.soundData.sound_recommend_list[index].like_my = 0;
          this.postUserLike(sound_pk, -1);
    }else{
      this.router.navigate(['/login']);
    }
  }

  //좋아요
  onClick_like(sound_pk, index){
    if (localStorage.getItem('auth')) {
          this.soundData.sound_list[index].like_my = 1;
          this.postUserLike(sound_pk, 1);
    }else{
      this.router.navigate(['/login']);
    }

  }

  //좋아요 취소
  onClick_dislike(sound_pk, index){
    if (localStorage.getItem('auth')) {
          this.soundData.sound_list[index].like_my = 0;
          this.postUserLike(sound_pk, -1);
    }else{
      this.router.navigate(['/login']);
    }
  }


  //서버로 좋아요 값 전송
  postUserLike(sound_pk, heart){
    var path = '/user_like';
    var auth = JSON.parse(localStorage.getItem('auth'));
    var token = auth.token;

    var postData = {token:token, sound_pk:sound_pk, heart:heart};
    this.postTestService.postServer(path, postData).subscribe(data => {
      console.log("like처리");
    });
  }
}
