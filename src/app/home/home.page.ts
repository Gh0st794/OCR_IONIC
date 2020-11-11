import { Component } from '@angular/core';
import { createWorker } from 'tesseract.js';
import {Plugins, CameraResultType, CameraSource} from '@capacitor/core';
const { Camera } = Plugins;

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  
  worker: Tesseract.Worker;
  workerReady = false;
  image ='';
  ocrResult = '';
  captureProgress = 0;

  constructor() {
    this.loadWorker();
  }

  async loadWorker(){
    this.worker = createWorker({
      logger: progress => {    
        if(progress.status == 'recognizing text'){
          this.captureProgress = parseInt('' + progress.progress * 100);
        }
      }
    });

    await this.worker.load();
    await this.worker.loadLanguage('eng');
    await this.worker.initialize('eng');
    
    this.workerReady = true;
  }

  async captureImage(){
    const imagen = await Camera.getPhoto({
      quality: 100,
      correctOrientation: true,
      allowEditing: true,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Camera      
    });    
    this.image = imagen.dataUrl;
  }

  async recognizeImage(){
    const result = await this.worker.recognize(this.image);    
    this.ocrResult = result.data.text;
  }

}
