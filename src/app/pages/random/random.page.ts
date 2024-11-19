import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Motion } from '@capacitor/motion';
import { IonContent, IonHeader, IonTitle, IonToolbar,IonCard,IonCardHeader,IonCardTitle,IonCardContent,IonFab,IonFabButton,IonIcon,IonImg } from '@ionic/angular/standalone';

//ICONOS
import { addIcons } from 'ionicons';
import { arrowBackOutline } from 'ionicons/icons';
import { HttpClient,HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-random',
  templateUrl: './random.page.html',
  styleUrls: ['./random.page.scss'],
  standalone: true,
  imports: [HttpClientModule,IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule,IonCard,IonCardHeader,IonCardTitle,IonCardContent,IonFab,IonFabButton,IonIcon,IonImg]
})
export class RandomPage implements OnInit {
  cocktail:any //GUARDAR LA RESPUESTA POR HTTP

  constructor(private http:HttpClient,private router: Router) {
    addIcons({ arrowBackOutline });
   }

  ngOnInit() {
    this.startShakeDetection();
  }

  async startShakeDetection(){
    await Motion.addListener('accel',async (event) => {
      console.log("TEST MOTION")
      const threshold = -1
      if(
        Math.abs(event.acceleration.x) > threshold &&
        Math.abs(event.acceleration.y) > threshold &&
        Math.abs(event.acceleration.z) > threshold
      ){
        this.getRandomCocktail()
      }
    })
  }

  async getRandomCocktail(){
    try{
      const response = await this.http.get('https://www.thecocktaildb.com/api/json/v1/1/random.php').toPromise()
      if(response && (response as any).drinks && (response as any).drinks.length >0){
        this.cocktail = (response as any).drinks[0]
      }else{
        console.log("No se pudo obtener el coctel")
      }
    }catch(error){
      console.log("Error obteninedo random coctel por API:",error)
    }
  }
  goToListar(){
    this.router.navigate(['/listar-cocteles']);
  }
  


}
