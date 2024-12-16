import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar,IonButton, IonCard, IonCardHeader,IonCardTitle,IonCardSubtitle,IonCardContent,IonList,IonItem,IonThumbnail,IonLabel, IonFab, IonFabButton,IonIcon,IonSearchbar } from '@ionic/angular/standalone';
import { Router } from '@angular/router'; // Importa el módulo para la navegación entre rutas

//ICONOS
import { addIcons } from 'ionicons';
import { add,wineOutline } from 'ionicons/icons';
import { HttpClient } from '@angular/common/http';
import { StorageService } from '../../services/storage.service';

export interface Coctel{
  nombre:String,
  descripcion:String,
  ingredientes:String[],
  alcoholico:boolean,
  precio:number,
  imagenUrl:String
}


@Component({
  selector: 'app-listar-cocteles',
  templateUrl: './listar-cocteles.page.html',
  styleUrls: ['./listar-cocteles.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar,IonButton, CommonModule, FormsModule,IonCard, IonCardHeader,IonCardTitle,IonCardSubtitle,IonCardContent,IonList,IonItem,IonThumbnail,IonLabel, IonFab, IonFabButton,IonIcon,IonSearchbar]
})
export class ListarCoctelesPage implements OnInit {
  searchTerm: string = '';
  cocteles:Coctel[] = []
  /*cocteles:Coctel[] = [
    { nombre: 'Tequila Margarita', descripcion: 'Un coctel refrescante con tequila y limón.', ingredientes: ['Tequila', 'Limón', 'Sal'], alcoholico: true, precio: 1200,imagenUrl:"https://www.thecocktaildb.com/images/media/drink/5noda61589575158.jpg" },
    { nombre: 'Pisco Sour', descripcion: 'Una bebida ácida y espumosa a base de pisco.', ingredientes: ['Pisco', 'Limón', 'Azúcar', 'Clara de huevo'], alcoholico: true, precio: 1500,imagenUrl:"https://www.thecocktaildb.com/images/media/drink/5noda61589575158.jpg" },
    { nombre: 'Ron Cola', descripcion: 'El clásico ron con cola.', ingredientes: ['Ron', 'Cola'], alcoholico: true, precio: 1000,imagenUrl:"https://www.thecocktaildb.com/images/media/drink/5noda61589575158.jpg" },
    { nombre: 'Mojito', descripcion: 'Coctel cubano refrescante con menta.', ingredientes: ['Ron', 'Menta', 'Azúcar', 'Agua con gas'], alcoholico: true, precio: 1300,imagenUrl:"https://www.thecocktaildb.com/images/media/drink/5noda61589575158.jpg" }
  ]*/

  constructor(private router: Router,private http:HttpClient,private storageService: StorageService) {
    addIcons({ add,wineOutline });
   }

  ngOnInit() {
    this.obtenerDataApi()
  }

  goToCreate(){
    this.router.navigate(['/agregar-cocteles']);
  }
  goToRandom(){
    this.router.navigate(['/random']);
  }

  eliminarCoctel(index:number){
    this.cocteles.splice(index,1)
  }
  onSearchChange(event:String){
    console.log(event)
  }
  async obtenerDataApi(){
    const alphabet = 'abcdefghijklmnopqrstuvwxyz';
    const allCocktails: Coctel[] = [];
    for (const letter of alphabet) {
      const url = `https://www.thecocktaildb.com/api/json/v1/1/search.php?f=${letter}`;
      const response = await this.http.get<{ drinks: any[] }>(url).toPromise();
      console.log('Response:', url);
      console.log('Response:', response);
      if (response?.drinks) {
        const cocktails = response.drinks.map((drink) => ({
          nombre: drink.strDrink,
          descripcion: `Un delicioso cóctel con ${drink.strIngredient1}.`,
          ingredientes: [drink.strIngredient1],
          alcoholico: drink.strAlcoholic === 'Alcoholic',
          precio: 1500,
          imagenUrl: drink.strDrinkThumb
        }));
        allCocktails.push(...cocktails);
      }
      await this.delay(100); // Agregar un retraso de 500ms entre las solicitudes
      
    }
    await this.storageService.set('cocteles', allCocktails);
    this.cocteles = allCocktails;
  }

  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  onSearch(){
    if(this.searchTerm.trim()){
      //EJECUTAR FETCH
      const url = `https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=${this.searchTerm.trim()}`;
      this.http.get<{drinks: any[]}>(url).subscribe({
        next:(response) =>{
          if(response.drinks){
            this.cocteles = response.drinks.map((drink) => ({
              nombre: drink.strDrink,
              descripcion: `Un delicioso cóctel con ${this.searchTerm.trim()}.`,
              ingredientes: [this.searchTerm.trim()],
              alcoholico: true,
              precio: 1500,
              imagenUrl: drink.strDrinkThumb
            }))
          }
          else{
            this.cocteles = []
          }
        },
        error:(err)=>{
          console.error('Error al obtener los cocteles:',err)
        }
      })
    }else{
      this.cocteles = []
    }

  }

}
