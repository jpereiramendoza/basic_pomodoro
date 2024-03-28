import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { invoke } from "@tauri-apps/api/tauri";
import { Subscription, interval } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})



export class AppComponent {
  greetingMessage = "";

  // Almacena el tiempo en milisegundos;
  private timeMs : number = 0;

  private subscription: Subscription;

  private mostrarContador: boolean  = false ; 
  public tiempo :string = "00:00";


  public h1Clase: string = 'black';
  /**
   * Constructor de la aplicacion 
   * Ejecutamos un suscriptor cada 1 segundo 
   */
  constructor() {
    this.subscription = interval(1000).subscribe(() => {
      this.actualizaPomodoro();
    });
  }

  /**
   * Retorna el tiempo formateado en MM:SS 
   * @param segundos numero de segundos 
   * @returns 
   */
  obtenerTiempoFormateado(segundos: number): string {
    return `${String(Math.floor(segundos / 60)).padStart(2, '0')}:${String(segundos % 60).padStart(2, '0')}`;
  }

  /**
   * Si se requiere pausar el contador por algun motivo 
   */
  public pausarContador():void{
    if( this.timeMs>0)
    {
      this.mostrarContador = !this.mostrarContador;
      if(this.mostrarContador )
      {
        this.h1Clase = 'black';
      }
      else
      {
        this.h1Clase = 'red';
      }
    }
  }

  public actualizaPomodoro():void{

    if( this.mostrarContador )
    {
      if( this.timeMs > 0 )
      {
        this.tiempo = this.obtenerTiempoFormateado ( this.timeMs) ;
        this.timeMs -- ; 
        if( this.timeMs == 0 )
        { 
          const sonido = new Audio('https://themushroomkingdom.net/sounds/wav/smb/smb_world_clear.wav');
          sonido.play();
          //this.tiempo = "00:00";
        }
      }
    }
  }
  

  public iniciaPomodoro( tiempo : number):void {
    this.mostrarContador = true;
    this.timeMs =  tiempo * 60 ;
    this.actualizaPomodoro();
  }
  greet(event: SubmitEvent, name: string): void {
    event.preventDefault();

    // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
    invoke<string>("greet", { name }).then((text) => {
      this.greetingMessage = text;
    });
  }
}
